import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, InputNumber, DatePicker, Checkbox, Row, Col, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';

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
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);


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

  const handleCityChange = (city: string, index: number, type: string) => {
    const newRoutes = [...routes];
    newRoutes[index][type] = city;
    setRoutes(newRoutes);
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
                    <Input value={route.addressFrom} onChange={(e) => {
                      const newRoutes = [...routes];
                      newRoutes[index].addressFrom = e.target.value;
                      setRoutes(newRoutes);
                    }} />
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
                <Input value={route.addressTo} onChange={(e) => {
                  const newRoutes = [...routes];
                  newRoutes[index].addressTo = e.target.value;
                  setRoutes(newRoutes);
                }} />
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
      </Form>
    </div>
  );
};

export default TripsPage;