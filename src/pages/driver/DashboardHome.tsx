import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Modal, message, Drawer, Button, Descriptions, Input } from 'antd';
import { StarFilled } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import { BACKEND_URL } from '../../config/config';



interface AvailableCargo {
  country: string;
  count: number;
}

interface MonthlyIncome {
  month: string;
  amount: number;
}

interface UserStatistics {
  totalIncome: number;
  availableOrdersCount: number;
  availableCargos: AvailableCargo[];
  monthlyIncome: MonthlyIncome[];
}

interface Route {
  countryFrom: string;
  cityFrom: string;
  addressFrom: string;
  countryTo: string;
  cityTo: string;
  addressTo: string;
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
}

interface UserProfile {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  telegram: string;
  whatsappAccount: string;
  companyName?: string;
}

const DashboardHome: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [visibleIncome, setVisibleIncome] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [createdCargoCount, setCreatedCargoCount] = useState<number>(0);
  const [userStatistics, setUserStatistics] = useState<UserStatistics | null>(null);
  const [completedCargoCount, setCompletedCargoCount] = useState<number>(0);
  const [userScore, setUserScore] = useState<number>(0);
  const [inProgressCargos, setInProgressCargos] = useState<Cargo[]>([]);
  const [selectedCargoDetails, setSelectedCargoDetails] = useState<Cargo | null>(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLegalInfoVisible, setIsLegalInfoVisible] = useState(false);

  const back = BACKEND_URL;
  
  const currentDate = dayjs().format('DD.MM.YYYY'); // Format current date

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

    // Запрос к бэкенду для получения статистики пользователя
    axios.get(`${back}/api/orders/user/statistics/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(response => {
      setUserStatistics(response.data);
    })
      .catch(error => {
        console.error('Ошибка при получении статистики пользователя:', error);
      });
  }, []);

  // Функция для отображения заполненных звезд
  const renderStars = (score: number) => {
    return (
      <div style={{ display: 'flex' }}>
        {[...Array(10)].map((_, index) => (
          <StarFilled key={index} style={{ color: index < score ? '#fadb14' : '#d9d9d9', fontSize: '24px' }} />
        ))}
      </div>
    );
  };

  const showIncome = () => {
    setVisibleIncome(true);
  };

  const handleCancelIncome = () => {
    setVisibleIncome(false);
  };

  const showAvailableCargos = () => {
    setSelectedCountry('Все');
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

    axios.get(`${back}/api/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        const user = response.data;
        setUserProfile(response.data);
        setUserName(user.firstName || ''); // Assuming 'name' field exists
        setUserScore(user.score || 0);
      })
      .catch(error => {
        message.error('Ошибка при получении данных пользователя');
      });

    axios.get(`${back}/api/orders/customer/active/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        const orders = response.data;
        setCreatedCargoCount(orders.length);
        setCompletedCargoCount(orders.filter((order: any) => order.status === 'Завершен').length);
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

  const closeDrawer = () => {
    setIsDrawerVisible(false);
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

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setUserProfile((prevProfile) => prevProfile ? { ...prevProfile, [field]: value } : null);
  };

  const toggleLegalInfo = () => {
    setIsLegalInfoVisible(!isLegalInfoVisible);
  };

  const saveUserProfile = () => {
    if (!userProfile) return;

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    axios.put(`${back}/api/users/${userId}`, userProfile, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        message.success('Информация о пользователе успешно обновлена');
      })
      .catch(error => {
        console.error('Ошибка при сохранении данных пользователя:', error);
        message.error('Не удалось сохранить изменения');
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Добрый день, {userName}!</h1>
      <p style={{ fontSize: '16px', marginBottom: '20px' }}>Сегодняшняя дата: {currentDate}</p>

      <Row gutter={16}>
        {/* Количество доступных грузов */}
        <Col xs={24} sm={24} md={8}>
          <Card
            title="Количество доступных грузов"
            bordered={false}
            onClick={showAvailableCargos}
            style={{
              height: '100px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <p style={{ fontSize: '20px', margin: 0 }}>
              {userStatistics?.availableOrdersCount || 0} грузов
            </p>
          </Card>
        </Col>

        {/* Доход пользователя за текущий месяц */}
        <Col xs={24} sm={24} md={8}>
          <Card
            title="Доход за текущий месяц"
            bordered={false}
            onClick={showIncome}
            style={{
              height: '100px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <p style={{ fontSize: '20px', margin: 0 }}>
              {userStatistics?.monthlyIncome && userStatistics.monthlyIncome.length > 0
                ? `${userStatistics.monthlyIncome[userStatistics.monthlyIncome.length - 1].amount} ₽`
                : 'Нет данных'}
            </p>
          </Card>
        </Col>

        {/* Балл (авторитет, производительность) */}
        <Col xs={24} sm={24} md={8}>
          <Card
            title="Балл"
            bordered={false}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {renderStars(userScore)}
              <span style={{ fontSize: '20px', marginLeft: '8px', lineHeight: '1' }}>{userScore}</span>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col span={24}>
          <Card title="Информация о пользователе" bordered={false}>
            <Descriptions column={1}>
              <Descriptions.Item label="Имя">
                <Input
                  value={userProfile?.firstName}
                  onChange={(e) => handleProfileChange('firstName', e.target.value)}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Фамилия">
                <Input
                  value={userProfile?.lastName}
                  onChange={(e) => handleProfileChange('lastName', e.target.value)}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Номер телефона">
                <Input
                  value={userProfile?.phoneNumber}
                  onChange={(e) => handleProfileChange('phoneNumber', e.target.value)}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Аккаунт Telegram">
                <Input
                  value={userProfile?.telegram}
                  onChange={(e) => handleProfileChange('telegram', e.target.value)}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Аккаунт WhatsApp">
                <Input
                  value={userProfile?.whatsappAccount}
                  onChange={(e) => handleProfileChange('whatsappAccount', e.target.value)}
                />
              </Descriptions.Item>
              {isLegalInfoVisible && (
                <Descriptions.Item label="Юридическая фирма">
                  <Input
                    value={userProfile?.companyName}
                    onChange={(e) => handleProfileChange('companyName', e.target.value)}
                  />
                </Descriptions.Item>
              )}
            </Descriptions>
            <Button onClick={toggleLegalInfo} style={{ marginTop: '10px' }}>
              {isLegalInfoVisible ? 'Скрыть юридическую информацию' : 'Юридическая компания'}
            </Button>
            <Button onClick={saveUserProfile} type="primary" style={{ marginTop: '10px', marginLeft: '10px' }}>
              Сохранить
            </Button>
          </Card>
        </Col>
      </Row>


      {/* Модальное окно для доходов за последние 12 месяцев */}
      <Modal title="Доходы за последние 12 месяцев" visible={visibleIncome} onCancel={handleCancelIncome} footer={null}>
        <ul>
          {userStatistics?.monthlyIncome && userStatistics.monthlyIncome.length > 0 ? (
            userStatistics.monthlyIncome.map((income) => (
              <li key={income.month}>
                {income.month}: {income.amount} ₽
              </li>
            ))
          ) : (
            <li>Нет данных о доходах</li>
          )}
        </ul>
      </Modal>

      {/* Список доступных грузов по странам */}
      <Modal
        title="Грузы по странам"
        visible={!!selectedCountry}
        onCancel={() => setSelectedCountry(null)}
        footer={null}
      >
        <ul>
          {userStatistics?.availableCargos && userStatistics.availableCargos.length > 0 ? (
            userStatistics.availableCargos.map((cargo) => (
              <li key={cargo.country}>
                {cargo.count} грузов из {cargo.country}
              </li>
            ))
          ) : (
            <li>Нет доступных грузов</li>
          )}
        </ul>
      </Modal>
    </div>
  );
};

export default DashboardHome;
