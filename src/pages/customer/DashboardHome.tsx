import React, { useEffect, useState } from 'react';
import { Card, Col, Row, message, Drawer, Descriptions, Button, Input } from 'antd';
import { StarFilled } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import { BACKEND_URL } from '../../config/config';


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
  const [createdCargoCount, setCreatedCargoCount] = useState<number>(0);
  const [completedCargoCount, setCompletedCargoCount] = useState<number>(0);
  const [userScore, setUserScore] = useState<number>(0);
  const [inProgressCargos, setInProgressCargos] = useState<Cargo[]>([]);
  const [selectedCargoDetails, setSelectedCargoDetails] = useState<Cargo | null>(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLegalInfoVisible, setIsLegalInfoVisible] = useState(false);

  const back = BACKEND_URL;

  const currentDate = dayjs().format('DD.MM.YYYY'); // Format current date

  const renderStars = (score: number) => {
    const maxScore = 10;
    const filledStars = Math.round((score / maxScore) * 5);
    return (
      <div style={{ display: 'flex' }}>
        {[...Array(5)].map((_, index) => (
          <StarFilled key={index} style={{ color: index < filledStars ? '#fadb14' : '#d9d9d9', fontSize: '24px' }} />
        ))}
      </div>
    );
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

    // Fetch user information including name
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

    // Fetch orders
    axios.get(`${back}/api/orders/customer/${userId}`, {
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

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setUserProfile((prevProfile) => prevProfile ? { ...prevProfile, [field]: value } : null);
  };

  const toggleLegalInfo = () => {
    setIsLegalInfoVisible(!isLegalInfoVisible);
  };


  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Добрый день, {userName}!</h1>
      <p style={{ fontSize: '16px', marginBottom: '20px' }}>Сегодняшняя дата: {currentDate}</p>

      <Row gutter={16}>
        <Col xs={24} sm={24} md={5}>
          <Card
            title="Созданные грузы"
            bordered={false}
            style={{
              height: '100px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <p style={{ fontSize: '20px', margin: 0 }}>{createdCargoCount}</p>
          </Card>
        </Col>
        <Col xs={18} sm={18} md={6}>
          <Card
            title="Завершенные грузы"
            bordered={false}
            style={{
              height: '100px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <p style={{ fontSize: '20px', margin: 0 }}>{completedCargoCount}</p>
          </Card>
        </Col>
        <Col xs={18} sm={18} md={6}>
          <Card
            title="Грузы в процессе доставки"
            bordered={false}
            style={{
              height: '100px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <p style={{ fontSize: '20px', margin: 0 }}>{completedCargoCount}</p>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={6}>
          <Card
            title="Ваш балл"
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
              <span style={{ fontSize: '20px', marginLeft: '8px' }}>{userScore}</span>
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
    </div>
  );
};

export default DashboardHome;
