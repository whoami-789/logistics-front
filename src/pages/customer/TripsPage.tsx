import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, InputNumber, DatePicker, Checkbox, Row, Col, Divider, Modal, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import YandexMap from '../../component/YandexMap';
import countryData from '../../eurasia_countries_and_cities_ru.json';
import { BACKEND_URL } from '../../config/config';




const { Option } = Select;

const TripsPage: React.FC = () => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [cargoType, setCargoType] = useState<string>('');
  const [tripType, setTripType] = useState<string>('');
  const [min, setMin] = useState<number | null>(null);
  const [max, SetMax] = useState<number | null>(null);
  const [adr, setADR] = useState<string>('');
  const [telegram, setTelegram] = useState<string>('');
  const [pnumber, setPnumber] = useState<string>('');
  const [length, setLength] = useState<number | null>(null);
  const [width, setWidth] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [num, setNum] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [advancePaymentPercentage, setAdvancePaymentPercentage] = useState<number | null>(null);
  const [advancePaymentMethod, setAdvancePaymentMethod] = useState<string>('');
  const [currency, setCurrency] = useState<string>('USD');
  const [nds, setNds] = useState<string>('Нет');
  const [routes, setRoutes] = useState<any[]>([{ countryFrom: '', cityFrom: '', addressFrom: '', countryTo: '', cityTo: '', addressTo: '' }]);
  const [carBody, setCarBody] = useState<string>('');
  const [countries, setCountries] = useState<{ name: string; code: string }[]>([]);
  const [cities, setCities] = useState<string[]>([]);


  const back = BACKEND_URL;


  const addRoute = () => {
    setRoutes([
      ...routes,
      {
        countryFrom: '',
        cityFrom: '',
        addressFrom: '',
        countryTo: '',
        cityTo: '',
        addressTo: ''
      }
    ]);
  };


  const handleSubmit = async () => {
    const userId = localStorage.getItem('userId');
    const numericUserId = userId ? parseInt(userId, 10) : null;
    const token = localStorage.getItem('token');

    const cargoData = {
      startDate: startDate?.toISOString(),  // Преобразуем дату в строку ISO
      weight,
      price,
      distance,
      cargoType,
      length,
      width,
      height,
      paymentMethod,
      advancePaymentPercentage,
      advancePaymentMethod,
      currency,
      min,
      max,
      adr,
      nds,
      telegram,
      pnumber,
      routes,  // Маршруты уже в нужном формате
      carBody,
      customerNum: numericUserId,  // Убедимся, что userId преобразован в число
    };


    try {
      const response = await axios.post(`${back}/api/orders`, cargoData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      notification.success({
        message: 'Успех',
        description: 'Заказ успешно создан!',
      });
    } catch (error) {
      console.error('Ошибка при создании заказа:', error);
      notification.error({
        message: 'Ошибка',
        description: 'Не удалось создать заказ. Пожалуйста, попробуйте снова.',
      });
    }
  };



  useEffect(() => {
    // При монтировании компонента установите список стран
    const countryList = countryData.countries.map((country: any) => ({
      name: country.name,
      code: country.countryCode
    }));
    setCountries(countryList);
  }, []);

  const fetchCities = (countryCode: string) => {
    // Найдите страну по коду
    const country = countryData.countries.find((c: any) => c.countryCode === countryCode);

    if (country) {
      setCities(country.cities);
    } else {
      console.error("Country not found");
      setCities([]); // Очистите список городов, если страна не найдена
    }
  };

  const handleCountryChange = (value: string, index: number, type: 'countryFrom' | 'countryTo') => {
    const updatedRoutes = [...routes];
    updatedRoutes[index][type] = value;
    setRoutes(updatedRoutes);

    if (type === 'countryFrom') {
      // Загружаем города отправления при изменении страны отправления
      fetchCities(value);
    } else {
      // Загружаем города назначения при изменении страны назначения
      fetchCities(value);
    }
  };

  const handleCityChange = (value: string, index: number, type: 'cityFrom' | 'cityTo') => {
    const updatedRoutes = [...routes];
    updatedRoutes[index][type] = value;
    setRoutes(updatedRoutes);
  };

  const handleAddressChange = (address: string, index: number, type: 'from' | 'to') => {
    const updatedRoutes = [...routes];
    if (type === 'from') {
      updatedRoutes[index].addressFrom = address;
    } else {
      updatedRoutes[index].addressTo = address;
    }
    setRoutes(updatedRoutes);
  };



  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h2>Создать новый груз</h2>
      <Form layout="vertical" onFinish={handleSubmit}>
        {/* Многостоповая поездка */}
        <h3>Маршруты</h3>
        {routes.map((route, index) => (
          <Row key={index} gutter={16}>
            {index === 0 && (
              <>
                <Col span={8}>
                  <Form.Item label="Страна отправления" name={`fromcountry${index}`}>
                    <Select
                      showSearch
                      placeholder="Выберите страну"
                      onChange={(key) => handleCountryChange(key, index, 'countryFrom')}
                    >
                      {countries.map((country) => (
                        <Option key={country.name} value={country.code}>
                          {country.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Город отправления" name={`fromcity${index}`}>
                    <Select
                      showSearch
                      placeholder="Выберите город"
                      onChange={(value) => handleCityChange(value, index, 'cityFrom')}
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
                  <Form.Item label="Адрес отправления" name={`fromaddress${index}`}>
                    <Input
                      value={route.addressFrom}
                      onChange={(e) => handleAddressChange(e.target.value, index, 'from')}
                    />
                  </Form.Item>
                </Col>
              </>
            )}

            <Col span={8}>
              <Form.Item label="Страна назначения" name={`tocountry${index}`}>
                <Select
                  showSearch
                  placeholder="Выберите страну"
                  onChange={(key) => handleCountryChange(key, index, 'countryTo')}
                >
                  {countries.map((country) => (
                    <Option key={country.name} value={country.code}>
                      {country.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Город назначения" name={`tocity${index}`}>
                <Select
                  showSearch
                  placeholder="Выберите город"
                  onChange={(value) => handleCityChange(value, index, 'cityTo')}
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
              <Form.Item label="Адрес назначения" name={`toaddress${index}`}>
                <Input
                  value={route.addressTo}
                  onChange={(e) => handleAddressChange(e.target.value, index, 'to')}
                />
              </Form.Item>
            </Col>
          </Row>
        ))}

        <Button type="dashed" onClick={addRoute} style={{ width: '100%', marginBottom: '20px' }}>
          <PlusOutlined /> Добавить пункт назначения
        </Button>


        <Divider />


        <Row gutter={16}>
          <Col span={5}>
            <Form.Item label="Дата начала"
              name="startDate"
              rules={[{ required: true, message: 'Выберите дату начала' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                onChange={(date: Dayjs | null) => setStartDate(date)}
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="Тип кузова"
              name="ktype"
              rules={[{ required: true, message: 'Выберите тип кузова' }]}
            >
              <Select value={carBody} onChange={(value, option) => setCarBody(value)}>
                <Option value="Тентованный">Тентованный</Option>
                <Option value="Открытый">Открытый</Option>
                <Option value="Рефрижератор">Рефрижератор</Option>
                <Option value="Бортовый">Бортовый</Option>
                <Option value="Цельнометаллический">Цельнометаллический </Option>
                <Option value="Паровоз">Паровоз</Option>
                <Option value="Фура стандарт 96 кб3">Фура стандарт 96 кб3</Option>
                <Option value="Мега фура 105 кб3">Мега фура 105 кб3</Option>
                <Option value="20 контейнер">20 контейнер</Option>
                <Option value="40 контейнер">40 контейнер</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="Телеграм аккаунт"
              name="telegram"
              rules={[{ required: true, message: 'Введите телеграм аккаунт' }]}
            >
              <Input style={{ width: '100%' }} min={0} onChange={(value) => setTelegram(value.target.value)} />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="Номер телефона"
              name="pnumber"
              rules={[{ required: true, message: 'Введите номер телефона' }]}
            >
              <Input style={{ width: '100%' }} min={0} onChange={(value) => setPnumber(value.target.value)} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="Вес (тонн)">
              <InputNumber style={{ width: '100%' }} min={0} onChange={(value) => setWeight(value)} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={3}>
            <Form.Item label="Расстояние">
              <InputNumber style={{ width: '100%' }} min={0} onChange={(value) => setDistance(value)} placeholder='км' />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="Тип груза">
              <Select value={cargoType} onChange={(value) => setCargoType(value)}>
                <Option value="Габариты">Габариты</Option>
                <Option value="Коробки">Коробки</Option>
                <Option value="Навалом">Навалом</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="Тип перевозки">
              <Select value={tripType} onChange={(value) => setTripType(value)}>
                <Option value="FTL ( выделенный транспорт )">FTL ( выделенный транспорт )</Option>
                <Option value="LTL ( догруз )">LTL ( догруз )</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Температурный режим">
              <Row gutter={2}>
                <Col span={12}>
                <InputNumber style={{ width: '100%' }} placeholder='мин' min={-100} onChange={(value) => setMin(value)} />
                </Col>
                <Col span={12}>
                <InputNumber style={{ width: '100%' }} placeholder='макс' min={-100} onChange={(value) => SetMax(value)} />
                </Col>
              </Row>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="ADR (опасный груз)">
              <Select value={adr} onChange={(value) => setADR(value)}>
              <Option value="Да">ДА</Option>
              <Option value="Нет">Нет</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Поля для габаритов */}
        {cargoType === 'габариты' && (
          <Row gutter={16}>
            <Col span={3}>
              <Form.Item label="Длина (м)">
                <InputNumber style={{ width: '100%' }} min={0} onChange={(value) => setLength(value)} />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item label="Ширина (м)">
                <InputNumber style={{ width: '100%' }} min={0} onChange={(value) => setWidth(value)} />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item label="Высота (м)">
                <InputNumber style={{ width: '100%' }} min={0} onChange={(value) => setHeight(value)} />
              </Form.Item>
            </Col>
          </Row>
        )}
        {cargoType === 'коробки' && (
          <Row gutter={16}>
            <Col span={3}>
              <Form.Item label="Колличество">
                <InputNumber style={{ width: '100%' }} min={0} onChange={(value) => setNum(value)} />
              </Form.Item>
            </Col>
          </Row>
        )}

        <Row gutter={16}>
          <Col span={5}>
            <Form.Item label="Способ оплаты">
              <Select value={paymentMethod} onChange={(value) => setPaymentMethod(value)}>
                <Option value="Наличные">Наличные</Option>
                <Option value="Банковский перевод">Банковский перевод</Option>
                <Option value="На карточку">На карточку</Option>
                <Option value="Другой способ">Другой способ</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="Стоимость заказа">
              <InputNumber style={{ width: '100%' }} min={0} onChange={(value) => setPrice(value)} />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="Метод аванса">
              <Select value={advancePaymentMethod} onChange={(value) => setAdvancePaymentMethod(value)}>
                <Option value="Наличные">Наличные</Option>
                <Option value="Банковский перевод">Банковский перевод</Option>
                <Option value="На карточку">На карточку</Option>
                <Option value="Другой способ">Другой способ</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item label="Аванс (%)">
              <InputNumber style={{ width: '100%' }} min={0} max={100} onChange={(value) => setAdvancePaymentPercentage(value)} />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item label="Валюта">
              <Select value={currency} onChange={(value) => setCurrency(value)}>
                <Option value="USD">USD</Option>
                <Option value="RUB">RUB</Option>
                <Option value="EUR">EUR</Option>
                <Option value="UAH">UAH</Option>
                <Option value="BYN">BYN</Option>
                <Option value="KZT">KZT</Option>
                <Option value="UZS">UZS</Option>
                <Option value="TMT">TMT</Option>
                <Option value="KGS">KGS</Option>
                <Option value="TJS">TJS</Option>
                <Option value="AMD">AMD</Option>
                <Option value="AZN">AZN</Option>
                <Option value="MDL">MDL</Option>
                <Option value="CNY">CNY</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item label="НДС">
              <Select value={nds} onChange={(value) => setNds(value)}>
                <Option value="ДА">ДА</Option>
                <Option value="Нет">Нет</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>


        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
          Создать груз
        </Button>
      </Form>
    </div>
  );
};

export default TripsPage;