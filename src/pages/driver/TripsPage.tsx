import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, InputNumber, Row, Col, Divider, Table, Drawer, message, Descriptions, Card, DatePicker, Modal, Typography } from 'antd';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import { SearchOutlined } from '@ant-design/icons';
import { BACKEND_URL } from '../../config/config';
import countryData from '../../eurasia_countries_and_cities_ru.json';
import moment from 'moment';
import form from 'antd/es/form';

const { Title, Text } = Typography;
const { Option } = Select;

interface Filters {
  minCargoWeight: number | null;
  maxCargoWeight: number | null;
  cargoType?: string | null;
  price?: number | null;
  distance?: number | null;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  currency?: string | null;
  roundTrip?: boolean | null;
}

interface Route {
  countryFrom: string;
  cityFrom: string;
  addressFrom: string;
  countryTo: string;
  cityTo: string;
  addressTo: string;
  flagUrlFrom?: string;
  countryNameFrom?: string;
  flagUrlTo?: string;
  countryNameTo?: string;
}

interface Cargo {
  id: number;
  startDate: string;
  endDate?: string;
  weight: number;
  price: number;
  distance: number;
  cargoType: string;
  length?: number;
  width?: number;
  height?: number;
  paymentMethod: string;
  advancePaymentPercentage?: number;
  advancePaymentMethod?: string;
  currency: string;
  roundTrip: boolean;
  routes: Route[];
  customer: string;
  executor?: string;
  carBody: string;
  workType: string;
  status: string;
  customerStatus: string;
  driverStatus: string;
  carType: string;
  min: number;
  max: number;
  adr: string;
  nds: string;
  telegram: string;
  pnumber: string;
  tripType: string;
}


const TripsPage: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    minCargoWeight: null,
    maxCargoWeight: null,
    cargoType: null,
    price: null,
    distance: null,
    length: null,
    width: null,
    height: null,
    currency: null,
    roundTrip: null,
  });

  const [trips, setTrips] = useState<Cargo[]>([]);
  const [filterSaved, setFilterSaved] = useState(false);
  const [inProgressCargos, setInProgressCargos] = useState<Cargo[]>([]);
  const [selectedCargoDetails, setSelectedCargoDetails] = useState<Cargo | null>(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [currency, setCurrency] = useState<string>('USD');
  const [routes, setRoutes] = useState<any[]>([{ countryFrom: '', cityFrom: '', addressFrom: '', countryTo: '', cityTo: '', addressTo: '' }]);
  const [carBody, setCarBody] = useState<string>('');
  const [countries, setCountries] = useState<{ name: string; code: string }[]>([]);
  const [cities, setCities] = useState<{ [key: number]: string[] }>({});
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [selectedCargo, setSelectedCargo] = useState<Cargo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [filteredCargos, setFilteredCargos] = useState([]);
  const [minWeight, setMinWeight] = useState<number | null>(null);
  const [maxWeight, setMaxWeight] = useState<number | null>(null);
  const [priceFrom, setPriceFrom] = useState<number | null>(null);
  const [priceTo, setPriceTo] = useState<number | null>(null);
  // const [intervalId, setIntervalId] = useState<Timer | null>(null);  // Используем тип Timer вместо number
  // const [isAutoUpdating, setIsAutoUpdating] = useState(false);  // Для отслеживания состояния автообновления


  const back = BACKEND_URL;

  // const startAutoUpdate = (interval: number) => {  // Указан тип для параметра interval
  //   // Останавливаем предыдущий интервал, если он был
  //   if (intervalId !== null) {
  //     clearInterval(intervalId);
  //   }

  //   // Устанавливаем новый интервал для обновления
  //   const id = setInterval(() => {
  //     console.log('Обновление данных...');  // Здесь можно вызвать функцию для обновления данных
  //     // Например, обновление списка грузов
  //   }, interval);

  //   setIntervalId(id);  // Сохраняем ID интервала для возможности остановить его
  //   setIsAutoUpdating(true);  // Устанавливаем состояние автообновления в true
  // };

  // const stopAutoUpdate = () => {
  //   // Останавливаем автообновление
  //   if (intervalId !== null) {
  //     clearInterval(intervalId);
  //   }
  //   setIsAutoUpdating(false);
  // };

  const handleFilterChange = (changedValues: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...changedValues }));
  };

  const saveFilters = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      message.error('Пользователь не авторизован');
      return;
    }

    try {
      const filtersData = {
        driver: { id: userId },
        ...filters,
      };

      await axios.post(`${back}/api/driver-filters`, filtersData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setFilterSaved(true);
      message.success('Фильтры успешно сохранены');
      fetchFilteredTrips(filters);
    } catch (error) {
      console.error('Ошибка при сохранении фильтров: ', error);
      message.error('Ошибка при сохранении фильтров');
    }
  };

  const fetchFilteredTrips = async (filterParams: Filters) => {
    const token = localStorage.getItem('token');

    if (!token) {
      message.error('Пользователь не авторизован');
      return;
    }

    try {
      const filteredParams = Object.fromEntries(
        Object.entries(filterParams).filter(([_, v]) => v != null)
      );
      const response = await axios.post(`${back}/api/trips/filter`, filteredParams, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setTrips(response.data);
    } catch (error) {
      console.error('Ошибка при получении поездок: ', error);
    }
  };

  const fetchTrips = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      message.error('Пользователь не авторизован');
      return;
    }

    try {
      const response = await axios.get(`${back}/api/orders/active`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setTrips(response.data);
    } catch (error) {
      console.error("Ошибка при получении поездок: ", error);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const closeDrawer = () => {
    setDrawerVisible(false);
    setIsDrawerVisible(false);
    setSelectedCargoDetails(null);
    setSelectedCargo(null);
  };

  const handleTakeOrder = async () => {
    if (!selectedCargoDetails) {
      console.log('Детали груза не выбраны');
      return;
    }
    console.log('Кнопка нажата'); // Проверяем, срабатывает ли обработчик

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      message.error('Пользователь не авторизован');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(`${back}/api/orders/status/driver/${selectedCargo?.id}`, null, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: {
          status: "Забронирован",
          driverId: userId,
        },
      });

      if (response.status === 200) {
        message.success('Груз успешно взят');
        console.log("Груз забронирован, обновляем список...");
        await fetchTrips(); // Обновляем список грузов
        closeDrawer(); // Закрываем Drawer
        setSelectedCargo(null); // Очищаем выбранный груз
      } else {
        message.error('Не удалось взять груз');
      }
    } catch (error) {
      console.error("Ошибка при взятии заказа: ", error);
      message.error('Ошибка при взятии заказа');
    } finally {
      setLoading(false);
    }
  };



  const handleRowClick = (record: Cargo) => {
    setSelectedCargoDetails(record);
    setDrawerVisible(true);
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId) {
      message.error('Пользователь не найден');
      return;
    }

    if (!token) {
      message.error('Токен авторизации отсутствует');
      return;
    }

    axios.get(`${back}/api/orders/exclude-customer/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        const orders = response.data;
        const cargos = orders.map((order: any) => ({
          id: order.id,
          startDate: order.startDate,
          endDate: order.endDate,
          weight: order.weight,
          price: order.price,
          distance: order.distance,
          cargoType: order.cargoType,
          length: order.length,
          width: order.width,
          height: order.height,
          paymentMethod: order.paymentMethod,
          advancePaymentPercentage: order.advancePaymentPercentage,
          advancePaymentMethod: order.advancePaymentMethod,
          currency: order.currency,
          roundTrip: order.roundTrip,
          status: order.status,
          customerStatus: order.customerStatus,
          driverStatus: order.driverStatus,
          routes: order.routes.map((route: any) => ({
            countryFrom: route.countryFrom,
            cityFrom: route.cityFrom,
            addressFrom: route.addressFrom,
            countryTo: route.countryTo,
            cityTo: route.cityTo,
            addressTo: route.addressTo,
          })),
          customer: order.customerNum,
          executor: order.executorId,
          carBody: order.carBody,
          workType: order.workType,
        }));
        setInProgressCargos(cargos);
      })
      .catch(error => {
        message.error('Ошибка при получении заказов');
      });
  }, []);

  const openDrawer = (cargo: Cargo) => {
    setSelectedCargoDetails(cargo);
    setIsDrawerVisible(true);
  };

  const changeCustomerStatus = (orderId: number, newStatus: string) => {
    const token = localStorage.getItem('token');

    if (!token) {
      message.error('Токен авторизации отсутствует');
      return;
    }

    axios.put(`${back}/api/orders/status/customer/${orderId}?status=${newStatus}`, null, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        message.success('Статус успешно обновлен');

        // Повторный запрос для обновления списка грузов
        const userId = localStorage.getItem('userId');

        axios.get(`${back}/api/orders/customer/active/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
          .then(response => {
            const orders = response.data;
            const updatedCargos = orders.map((order: any) => ({
              id: order.id,
              startDate: order.startDate,
              endDate: order.endDate,
              weight: order.weight,
              price: order.price,
              distance: order.distance,
              cargoType: order.cargoType,
              length: order.length,
              width: order.width,
              height: order.height,
              paymentMethod: order.paymentMethod,
              advancePaymentPercentage: order.advancePaymentPercentage,
              advancePaymentMethod: order.advancePaymentMethod,
              currency: order.currency,
              roundTrip: order.roundTrip,
              status: order.status,
              customerStatus: order.customerStatus,
              driverStatus: order.driverStatus,
              routes: order.routes.map((route: any) => ({
                countryFrom: route.countryFrom,
                cityFrom: route.cityFrom,
                addressFrom: route.addressFrom,
                countryTo: route.countryTo,
                cityTo: route.cityTo,
                addressTo: route.addressTo,
              })),
              customer: order.customerNum,
              executor: order.executorId,
              carBody: order.carBody,
              workType: order.workType,
            }));
            setInProgressCargos(updatedCargos);  // Обновляем список грузов
          })
          .catch(error => {
            message.error('Ошибка при обновлении списка грузов');
          });
      })
      .catch(error => {
        message.error('Ошибка при обновлении статуса');
      });
  };

  useEffect(() => {
    const countryList = countryData.countries.map((country: any) => ({
      name: country.name,
      code: country.countryCode
    }));
    setCountries(countryList);
  }, [countryData]);

  const fetchCities = (countryCode: string, index: number) => {
    const country = countryData.countries.find((c: any) => c.countryCode === countryCode);

    if (country) {
      setCities((prevCities) => ({
        ...prevCities,
        [index]: country.cities
      }));
    } else {
      console.error("Country not found");
      setCities((prevCities) => ({
        ...prevCities,
        [index]: []
      }));
    }
  };

  const handleCountryChange = (countryCode: string, index: number, type: string) => {
    const selectedCountry = countries.find(country => country.code === countryCode)?.name;
    const newRoutes = [...routes];
    newRoutes[index][type] = selectedCountry;
    setRoutes(newRoutes);

    fetchCities(countryCode, index); // Получаем города для конкретного маршрута
  };

  const handleCityChangeWrapper = (city: string, index: number, type: string) => {
    const newRoutes = [...routes];
    newRoutes[index][type] = city;
    setRoutes(newRoutes);
    handleCityChange(city, index, type);
  };

  const handleCityChange = async (city: string, index: number, type: string) => {
    const newRoutes = [...routes];
    newRoutes[index][type] = city;
    setRoutes(newRoutes);
  };

  useEffect(() => {
    fetchUnbookedCargos();
  }, []);

  const fetchUnbookedCargos = async () => {
    setLoading(true);
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    const back = BACKEND_URL;

    try {
      const response = await axios.get(`${back}/api/orders/active`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const cargosWithCountryData = response.data.map((cargo: Cargo) => ({
        ...cargo,
        routes: cargo.routes.map(route => ({
          ...route,
          ...getCountryInfo(route.countryFrom, 'From'),
          ...getCountryInfo(route.countryTo, 'To')
        }))
      }));

      setCargos(cargosWithCountryData);
    } catch (error) {
      console.error('Ошибка при получении незабронированных грузов:', error);
      message.error('Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  const getCountryInfo = (countryCode: string, direction: 'From' | 'To') => {
    const country = countryData.countries.find((c: any) => c.countryCode === countryCode);
    if (country) {
      return direction === 'From'
        ? { flagUrlFrom: country.flagUrl, countryNameFrom: country.name }
        : { flagUrlTo: country.flagUrl, countryNameTo: country.name };
    }
    return {};
  };

  const showDrawer = (cargo: Cargo) => {
    setSelectedCargo(cargo);
    setSelectedCargoDetails(cargo);
    setDrawerVisible(true);
  };

  const getCountryCodeByName = (countryName: string) => {
    const country = countryData.countries.find(country => country.name === countryName);
    return country ? country.countryCode : null;
  };

  const handleSearch = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const countryFromCode = getCountryCodeByName(routes[0]?.countryFrom);
    const countryToCode = getCountryCodeByName(routes[routes.length - 1]?.countryTo);


    try {
      const response = await axios.get(`${back}/api/orders/filter`, {
        params: {
          startDate: startDate ? startDate.format('YYYY-MM-DD') : null,
          carBody,
          minWeight,  // Используем minWeight
          maxWeight,  // Используем maxWeight
          priceFrom,   // Цена от
          priceTo,     // Цена до
          currency,
          countryFrom: countryFromCode, // Предположим, что маршруты это массив
          cityFrom: routes[0]?.cityFrom,
          countryTo: countryToCode,
          cityTo: routes[0]?.cityTo,
          userId: userId,
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      const cargosWithCountryData = response.data.map((cargo: Cargo) => ({
        ...cargo,
        routes: cargo.routes.map(route => ({
          ...route,
          ...getCountryInfo(route.countryFrom, 'From'),
          ...getCountryInfo(route.countryTo, 'To')
        }))
      }));

      setCargos(cargosWithCountryData); // Обновляем состояние с отфильтрованными грузами
    } catch (error) {
      console.error('Error fetching filtered cargos:', error);
    }
  };



  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h2>Доступные грузы</h2>

      <Form layout="vertical" onValuesChange={handleFilterChange}>
        {routes.map((route, index) => (
          <Row key={index} gutter={16}>
            {/* Отображаем только для первого маршрута */}
            {index === 0 && (
              <>
                <Col span={10}>
                  <Form.Item label="Страна отправления" name={`fromcountry-${index}`}>
                    <Select
                      showSearch
                      placeholder="Выберите страну"
                      optionFilterProp="children"
                      onChange={(value) => handleCountryChange(value, index, 'countryFrom')}
                      filterOption={(input, option) => {
                        const optionText = (option?.children as unknown as string) || '';
                        return optionText.toLowerCase().includes(input.toLowerCase());
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
                <Col span={10}>
                  <Form.Item label="Город отправления" name={`fromcity-${index}`}>
                    <Select
                      showSearch
                      placeholder="Выберите город"
                      optionFilterProp="children"
                      onChange={(value) => handleCityChangeWrapper(value, index, 'cityFrom')}
                      filterOption={(input, option) => {
                        const optionText = (option?.children as unknown as string) || '';
                        return optionText.toLowerCase().includes(input.toLowerCase());
                      }}
                    >
                      {(cities[index] || []).map((city) => (
                        <Option key={city} value={city}>
                          {city}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </>
            )}

            {/* Всегда отображаем поля назначения */}
            <Col span={10}>
              <Form.Item label="Страна назначения" name={`tocountry-${index}`}>
                <Select
                  showSearch
                  placeholder="Выберите страну"
                  optionFilterProp="children"
                  onChange={(value) => handleCountryChange(value, index, 'countryTo')}
                  filterOption={(input, option) => {
                    const optionText = (option?.children as unknown as string) || '';
                    return optionText.toLowerCase().includes(input.toLowerCase());
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
            <Col span={10}>
              <Form.Item label="Город назначения" name={`tocity-${index}`}>
                <Select
                  showSearch
                  placeholder="Выберите город"
                  optionFilterProp="children"
                  onChange={(value) => handleCityChangeWrapper(value, index, 'cityTo')}
                  filterOption={(input, option) => {
                    const optionText = (option?.children as unknown as string) || '';
                    return optionText.toLowerCase().includes(input.toLowerCase());
                  }}
                >
                  {(cities[index] || []).map((city) => (
                    <Option key={city} value={city}>
                      {city}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        ))}

        <Divider />

        <Row gutter={16}>
          <Col span={10}>
            <Form.Item label="Дата начала" name="startDate">
              <DatePicker
                style={{ width: '100%' }}
                onChange={(date: Dayjs | null) => setStartDate(date)}
              />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label="Тип кузова" name="carBody">
              <Select value={carBody} onChange={(value) => setCarBody(value)}>
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
        </Row>

        <Row gutter={16}>
          <Col span={4}>
            <Form.Item label="Мин вес (тонн)">
              <InputNumber style={{ width: '100%' }} min={0} onChange={(value) => setMinWeight(value)} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="Макс вес (тонн)">
              <InputNumber style={{ width: '100%' }} min={0} onChange={(value) => setMaxWeight(value)} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="Мин цена">
              <InputNumber style={{ width: '100%' }} min={0} onChange={(value) => setPriceFrom(value)} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="Макс цена">
              <InputNumber style={{ width: '100%' }} min={0} onChange={(value) => setPriceTo(value)} />
            </Form.Item>
          </Col>
          <Col span={4}>
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
        </Row>

        <Button type="dashed" htmlType="submit" style={{ width: '100%', marginBottom: '10px' }} onClick={handleSearch}>
          <SearchOutlined /> Поиск
        </Button>
        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
          Сохранить фильтры
        </Button>
      </Form>


      <div style={{ marginTop: '20px' }}>

        <div>
          {/* Кнопки для выбора интервала обновления */}
          {/* <div>
            <Button onClick={() => startAutoUpdate(3000)} disabled={isAutoUpdating}>Обновлять каждые 3 сек</Button>
            <Button onClick={() => startAutoUpdate(5000)} disabled={isAutoUpdating}>Обновлять каждые 5 сек</Button>
            <Button onClick={() => startAutoUpdate(10000)} disabled={isAutoUpdating}>Обновлять каждые 10 сек</Button>
            <Button onClick={() => startAutoUpdate(30000)} disabled={isAutoUpdating}>Обновлять каждые 30 сек</Button>
            <Button onClick={() => startAutoUpdate(60000)} disabled={isAutoUpdating}>Обновлять каждые 60 сек</Button>
            <Button onClick={() => startAutoUpdate(400000)} disabled={isAutoUpdating}>Обновлять каждые 400 сек</Button>
            {/* Кнопка для остановки автообновления 
            <Button onClick={stopAutoUpdate} disabled={!isAutoUpdating}>Остановить обновление</Button>
          </div> */}

          {cargos.map((cargo) => (
            <div
              key={cargo.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 20px',
                borderBottom: '1px solid #f0f0f0',
                cursor: 'pointer',
                width: '100%',
                backgroundColor: '#fafafa',
              }}
              onClick={() => showDrawer(cargo)}
            >
              <Text>
                <img src={cargo.routes[0].flagUrlFrom} alt={cargo.routes[0].countryNameFrom} style={{ width: '20px', marginRight: '5px' }} />
                {cargo.routes[0].countryNameFrom} ({cargo.routes[0].countryFrom}), {cargo.routes[0].cityFrom} →{' '}
                <img src={cargo.routes[cargo.routes.length - 1].flagUrlTo} alt={cargo.routes[cargo.routes.length - 1].countryNameTo} style={{ width: '20px', marginRight: '5px' }} />
                {cargo.routes[cargo.routes.length - 1].countryNameTo} ({cargo.routes[cargo.routes.length - 1].countryTo}), {cargo.routes[cargo.routes.length - 1].cityTo}
              </Text>
              <Text>Вес: {cargo.weight} кг</Text>
              <Text>Стоимость: {cargo.price} $</Text>
            </div>
          ))}

          <Drawer
            title="Детали груза"
            placement="right"
            closable={true}
            onClose={closeDrawer}
            visible={drawerVisible}
            width={800} // Увеличено для расширения Drawer влево
          >
            {selectedCargo && (
              <>
                {/* Маршруты */}
                <Text strong>Маршруты:</Text>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '8px', border: '1px solid #ddd' }}>Отправление</th>
                      <th style={{ textAlign: 'left', padding: '8px', border: '1px solid #ddd' }}>Назначение</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCargo.routes.map((route, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                        {index === 0 ? (
                          <>
                            <td style={{ padding: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <img src={route.flagUrlFrom} alt={route.countryNameFrom} style={{ width: '20px', marginRight: '8px' }} />
                                <Text>
                                  {route.countryNameFrom} ({route.countryFrom}), {route.cityFrom}, {route.addressFrom}
                                </Text>
                              </div>
                            </td>
                            <td style={{ padding: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <img src={route.flagUrlTo} alt={route.countryNameTo} style={{ width: '20px', marginRight: '8px' }} />
                                <Text>
                                  {route.countryNameTo} ({route.countryTo}), {route.cityTo}, {route.addressTo}
                                </Text>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td style={{ padding: '8px' }}></td> {/* Пустая ячейка для "Отправления" */}
                            <td style={{ padding: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <img src={route.flagUrlTo} alt={route.countryNameTo} style={{ width: '20px', marginRight: '8px' }} />
                                <Text>
                                  {route.countryNameTo} ({route.countryTo}), {route.cityTo}, {route.addressTo}
                                </Text>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Данные о грузе */}
                <div style={{ marginTop: 20 }}>
                  <div style={{ marginBottom: 20 }}>
                    <Text strong style={{ fontSize: '16px' }}>О грузе</Text><br />
                    <Text strong>ID груза:</Text> {selectedCargo.id}<br />
                    <Text strong>Дата начала:</Text> {selectedCargo.startDate}<br />
                    {selectedCargo.endDate && (
                      <>
                        <Text strong>Дата окончания:</Text> {selectedCargo.endDate}<br />
                      </>
                    )}
                    <Text strong>Вес:</Text> {selectedCargo.weight} кг<br />
                    <Text strong>Тип груза:</Text> {selectedCargo.cargoType}<br />
                    <Text strong>Габариты (ДxШxВ):</Text> {selectedCargo.length ?? '—'} x {selectedCargo.width ?? '—'} x {selectedCargo.height ?? '—'}<br />
                    <Text strong>Тип работы:</Text> {selectedCargo.workType}<br />
                    <Text strong>Тип поездки:</Text> {selectedCargo.tripType}<br />
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <Text strong style={{ fontSize: '16px' }}>Транспорт</Text><br />
                    <Text strong>Тип кузова:</Text> {selectedCargo.carBody}<br />
                    <Text strong>Мин. температура:</Text> {selectedCargo.min}<br />
                    <Text strong>Макс. температура:</Text> {selectedCargo.max}<br />
                    <Text strong>ADR:</Text> {selectedCargo.adr}<br />
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <Text strong style={{ fontSize: '16px' }}>Оплата</Text><br />
                    <Text strong>Стоимость:</Text> {selectedCargo.price} {selectedCargo.currency}<br />
                    <Text strong>Способ оплаты:</Text> {selectedCargo.paymentMethod}<br />
                    {selectedCargo.advancePaymentPercentage && (
                      <>
                        <Text strong>Авансовый платеж:</Text> {selectedCargo.advancePaymentPercentage}% ({selectedCargo.advancePaymentMethod})<br />
                      </>
                    )}
                    <Text strong>НДС:</Text> {selectedCargo.nds}<br />
                  </div>
                </div>

                {/* Контакты */}
                {selectedCargo.status === "Забронирован" && (
                  <div style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)' }}>
                    <Text strong style={{ fontSize: '16px' }}>Контакты</Text><br />
                    <Text strong>Телеграм:</Text> {selectedCargo.telegram}<br />
                    <Text strong>Номер телефона:</Text> {selectedCargo.pnumber}<br />
                  </div>
                )}

                {/* Кнопки */}
                <div style={{ marginTop: 20, textAlign: 'right' }}>
                  <Button type="primary" onClick={handleTakeOrder} style={{ marginRight: '10px' }}>
                    Забронировать
                  </Button>
                </div>
              </>
            )}
          </Drawer>

        </div>
      </div>
    </div>
  );
};

export default TripsPage;
