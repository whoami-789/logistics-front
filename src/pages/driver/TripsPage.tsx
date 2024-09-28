import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, InputNumber, DatePicker, Checkbox, Row, Col, Divider, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import YandexMap from '../../component/YandexMap';

const { Option } = Select;

const TripsPage: React.FC = () => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [cargoType, setCargoType] = useState<string>('');
  const [length, setLength] = useState<number | null>(null);
  const [width, setWidth] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [advancePaymentPercentage, setAdvancePaymentPercentage] = useState<number | null>(null);
  const [advancePaymentMethod, setAdvancePaymentMethod] = useState<string>('');
  const [currency, setCurrency] = useState<string>('USD');
  const [roundTrip, setRoundTrip] = useState<boolean>(false);
  const [routes, setRoutes] = useState<any[]>([{ countryFrom: '', cityFrom: '', addressFrom: '', countryTo: '', cityTo: '', addressTo: '' }]);
  const [carBody, setCarBody] = useState<string>('');
  const [countries, setCountries] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number | null>(null);
  const [selectedAddressType, setSelectedAddressType] = useState<'from' | 'to' | null>(null); // Тип адреса: 'from' или 'to'
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [initialCoords, setInitialCoords] = useState<[number, number] | null>(null);

  const handleAddressClick = (index: number, type: 'from' | 'to') => {
    setSelectedRouteIndex(index);
    setSelectedAddressType(type);

    // Установите координаты для выбранного города перед открытием модального окна
    const route = routes[index];
    if (type === 'from') {
      getCoordinatesForCity(route.cityFrom).then(coords => {
        setInitialCoords(coords);
        setModalVisible(true);
      });
    } else {
      getCoordinatesForCity(route.cityTo).then(coords => {
        setInitialCoords(coords);
        setModalVisible(true);
      });
    }
  };

  const addRoute = () => {
    setRoutes([...routes, { countryTo: '', cityTo: '', addressTo: '' }]);
  };


  const handleSubmit = () => {
    console.log({
      startDate, endDate, weight, price, distance, cargoType,
      length, width, height, paymentMethod, advancePaymentPercentage,
      advancePaymentMethod, currency, roundTrip, routes, carBody
    });
  };

  useEffect(() => {
    // Fetch countries on mount
    axios.get('https://restcountries.com/v3.1/all')
      .then((response) => {
        const countryList = response.data.map((country: any) => ({
          name: country.name.common,
          code: country.cca2
        }));
        setCountries(countryList);
      })
      .catch((error) => {
        console.error("Error fetching countries: ", error);
      });
  }, []);

  const fetchCities = (countryCode: string) => {
    axios.get(`http://api.geonames.org/searchJSON?country=${countryCode}&maxRows=10&username=whoami789`)
      .then((response) => {
        console.log(response.data); // Выведем данные в консоль
        const cityList = response.data.geonames.map((city: any) => city.name);
        setCities(cityList);
      })
      .catch((error) => {
        console.error("Error fetching cities: ", error);
      });
  };

  const handleCountryChange = (countryCode: string, index: number, type: string) => {
    const newRoutes = [...routes];
    newRoutes[index][type] = countryCode;
    setRoutes(newRoutes);
    fetchCities(countryCode);
  };

  const handleCityChange = async (city: string, index: number, type: string) => {
    const newRoutes = [...routes];
    newRoutes[index][type] = city;
    setRoutes(newRoutes);

    // Получаем координаты выбранного города
    try {
      const cityCoordinates = await getCoordinatesForCity(city);
      setInitialCoords(cityCoordinates); // обновляем координаты для карты

      // Если модалка открыта, обновляем координаты в ней
      if (modalVisible) {
        setModalVisible(false); // закрываем карту перед обновлением
        setTimeout(() => setModalVisible(true), 0); // открываем заново с новыми координатами
      }
    } catch (error) {
      console.error('Ошибка получения координат:', error);
      setInitialCoords([55.751244, 37.618423]); // дефолтные координаты
    }
  };



  const getCoordinatesForCity = async (city: string): Promise<[number, number]> => {
    const apiKey = 'a0182201-d5b3-4c80-8a64-9ac085a73d3d'; // Ваш ключ API
    const response = await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&geocode=${encodeURIComponent(city)}&format=json`);
    const data = await response.json();

    if (data && data.response && data.response.GeoObjectCollection && data.response.GeoObjectCollection.featureMember.length > 0) {
      const coordinates = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ');
      return [parseFloat(coordinates[1]), parseFloat(coordinates[0])]; // Возвращаем [широта, долгота]
    }
    return [55.751244, 37.618423]; // Возврат координат по умолчанию, если город не найден
  };

  const getAddressFromCoords = async (coords: [number, number]) => {
    const apiKey = 'a0182201-d5b3-4c80-8a64-9ac085a73d3d'; // Ваш ключ API
    const response = await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&geocode=${coords[1]},${coords[0]}&format=json`);
    const data = await response.json();

    if (data && data.response && data.response.GeoObjectCollection && data.response.GeoObjectCollection.featureMember.length > 0) {
      return data.response.GeoObjectCollection.featureMember[0].GeoObject.name; // Возвращаем адрес
    }
    return 'Адрес не найден'; // Возврат по умолчанию
  };

  const handleAddressSelect = (address: string) => {
    if (selectedRouteIndex !== null) {
      const newRoutes = [...routes];
      if (selectedAddressType === 'from') {
        newRoutes[selectedRouteIndex].addressFrom = address;
      } else {
        newRoutes[selectedRouteIndex].addressTo = address;
      }
      setRoutes(newRoutes);
    }

    // Сбрасываем координаты после выбора адреса
    setInitialCoords(null);
    setModalVisible(false); // Закрываем модалку после выбора адреса
  };





  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h2>Создать новый груз</h2>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Дата начала" required>
              <DatePicker
                style={{ width: '100%' }}
                onChange={(date: Dayjs | null) => setStartDate(date)}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Дата окончания" required>
              <DatePicker
                style={{ width: '100%' }}
                onChange={(date: Dayjs | null) => setEndDate(date)}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Вес (тонн)" required>
              <InputNumber style={{ width: '100%' }} min={0} onChange={(value) => setWeight(value)} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Стоимость заказа" required>
              <InputNumber style={{ width: '100%' }} min={0} onChange={(value) => setPrice(value)} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Расстояние (км)" required>
              <InputNumber style={{ width: '100%' }} min={0} onChange={(value) => setDistance(value)} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Тип груза" required>
              <Select value={cargoType} onChange={(value) => setCargoType(value)}>
                <Option value="габариты">Габариты</Option>
                <Option value="коробки">Коробки</Option>
                <Option value="навалом">Навалом</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Поля для габаритов */}
        {cargoType === 'габариты' && (
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Длина (м)">
                <InputNumber style={{ width: '100%' }} min={0} onChange={(value) => setLength(value)} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Ширина (м)">
                <InputNumber style={{ width: '100%' }} min={0} onChange={(value) => setWidth(value)} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Высота (м)">
                <InputNumber style={{ width: '100%' }} min={0} onChange={(value) => setHeight(value)} />
              </Form.Item>
            </Col>
          </Row>
        )}

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Способ оплаты" required>
              <Select value={paymentMethod} onChange={(value) => setPaymentMethod(value)}>
                <Option value="cash">Наличные</Option>
                <Option value="transfer">Перечисление</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Аванс (%)" required>
              <InputNumber style={{ width: '100%' }} min={0} max={100} onChange={(value) => setAdvancePaymentPercentage(value)} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Метод аванса" required>
              <Select value={advancePaymentMethod} onChange={(value) => setAdvancePaymentMethod(value)}>
                <Option value="cash">Наличные</Option>
                <Option value="transfer">Перечисление</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Валюта" required>
              <Select value={currency} onChange={(value) => setCurrency(value)}>
                <Option value="USD">USD</Option>
                <Option value="RUB">RUB</Option>
                <Option value="EUR">EUR</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Тип кузова" required>
              <Select value={carBody} onChange={(value) => setCarBody(value)}>
                <Option value="Тентованный">Тентованный</Option>
                <Option value="Открытый">Открытый</Option>
                <Option value="Рефрижератор">Рефрижератор</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Туда-обратно">
              <Checkbox checked={roundTrip} onChange={(e) => setRoundTrip(e.target.checked)}>Туда и обратно</Checkbox>
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        {/* Многостоповая поездка */}
        <h3>Маршруты</h3>
        {routes.map((route, index) => (
          <Row key={index} gutter={16}>
            {/* Отображаем только для первого маршрута */}
            {index === 0 && (
              <>
                <Col span={8}>
                  <Form.Item label="Страна отправления" required>
                    <Select
                      showSearch
                      placeholder="Выберите страну"
                      optionFilterProp="children"
                      onChange={(value) => handleCountryChange(value, index, 'countryFrom')}
                      filterOption={(input, option) => {
                        if (option && option.children) {
                          return option.children.toString().toLowerCase().includes(input.toLowerCase());
                        }
                        return false;
                      }}
                    >
                      {countries.map((country) => (
                        <Option key={country.code} value={country.code}>
                          {country.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Город отправления" required>
                    <Select
                      showSearch
                      placeholder="Выберите город"
                      optionFilterProp="children"
                      onChange={(value) => handleCityChange(value, index, 'cityFrom')}
                      filterOption={(input, option) => {
                        if (option && option.children) {
                          return option.children.toString().toLowerCase().includes(input.toLowerCase());
                        }
                        return false;
                      }}
                    >
                      {cities.map((city) => (
                        <Option key={city} value={city}>
                          {city}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Адрес отправления" required>
                    <Input
                      value={route.addressFrom}
                      onClick={() => handleAddressClick(index, 'from')} // Открываем карту для адреса отправления
                      readOnly // Делаем инпут только для чтения
                    />
                  </Form.Item>
                </Col>
              </>
            )}

            {/* Всегда отображаем поля назначения */}
            <Col span={8}>
              <Form.Item label="Страна назначения" required>
                <Select
                  showSearch
                  placeholder="Выберите страну"
                  optionFilterProp="children"
                  onChange={(value) => handleCountryChange(value, index, 'countryTo')}
                  filterOption={(input, option) => {
                    if (option && option.children) {
                      return option.children.toString().toLowerCase().includes(input.toLowerCase());
                    }
                    return false;
                  }}
                >
                  {countries.map((country) => (
                    <Option key={country.code} value={country.code}>
                      {country.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Город назначения" required>
                <Select
                  showSearch
                  placeholder="Выберите город"
                  optionFilterProp="children"
                  onChange={(value) => handleCityChange(value, index, 'cityTo')}
                  filterOption={(input, option) => {
                    if (option && option.children) {
                      return option.children.toString().toLowerCase().includes(input.toLowerCase());
                    }
                    return false;
                  }}
                >
                  {cities.map((city) => (
                    <Option key={city} value={city}>
                      {city}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Адрес назначения" required>
                <Input
                  value={route.addressTo}
                  onClick={() => handleAddressClick(index, 'to')} // Открываем карту для адреса назначения
                  readOnly // Делаем инпут только для чтения
                />
              </Form.Item>
            </Col>
          </Row>
        ))}


        <Button type="dashed" onClick={addRoute} style={{ width: '100%', marginBottom: '20px' }}>
          <PlusOutlined /> Добавить пункт назначения
        </Button>

        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
          Сохранить заказ
        </Button>

        {/* Modal for Yandex Map */}
        <Modal
          title="Выберите место на карте"
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={800}
        >
          <YandexMap initialCoords={initialCoords} onAddressSelect={handleAddressSelect} />
        </Modal>
      </Form>
    </div>
  );
};

export default TripsPage;