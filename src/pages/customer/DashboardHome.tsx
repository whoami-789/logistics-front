import React, { useEffect, useState } from 'react';
import { Card, Col, Row, message } from 'antd';
import { StarFilled } from '@ant-design/icons';
import axios from 'axios';

const DashboardHome: React.FC = () => {
  const [createdCargoCount, setCreatedCargoCount] = useState<number>(0);
  const [completedCargoCount, setCompletedCargoCount] = useState<number>(0);
  const [userScore, setUserScore] = useState<number>(0);
  const [inProgressCargos, setInProgressCargos] = useState<{ id: number; name: string; details: string }[]>([]);

  // Функция для отображения заполненных звезд
  const renderStars = (score: number) => {
    const maxScore = 150;
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
    console.log(localStorage)
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
  
    // Запрос на получение данных пользователя
    axios.get(`http://localhost:5050/api/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      const user = response.data;
      setUserScore(user.score || 0); // Предполагается, что поле score есть в модели пользователя
      setCreatedCargoCount(user.createdCargos || 0); // Пример
      setCompletedCargoCount(user.completedCargos || 0); // Пример
    })
    .catch(error => {
      message.error('Ошибка при получении данных пользователя');
    });
  
    // Запрос на получение всех заказов для заказчика
    axios.get(`http://localhost:5050/api/orders/customer/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      const orders = response.data;
      const cargos = orders.map((order: any) => ({
        id: order.id,
        name: `Груз ${order.id}`,
        details: order.details || `Детали для заказа ${order.id}`,
      }));
      setInProgressCargos(cargos);
    })
    .catch(error => {
      message.error('Ошибка при получении заказов');
    });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={16}>
        {/* Квадраты для созданных и завершенных грузов и балла */}
        <Col xs={24} sm={24} md={8}>
          <Card
            title={
              <span style={{ borderBottom: 'none' }}>Созданные грузы</span>
            }
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
        <Col xs={24} sm={24} md={8}>
          <Card
            title={
              <span style={{ borderBottom: 'none' }}>Завершенные грузы</span>
            }
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
        <Col xs={24} sm={24} md={8}>
          <Card
            title={
              <span style={{ borderBottom: 'none' }}>Ваш балл</span>
            }
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

      {/* Прямоугольники для грузов в процессе доставки с прокруткой */}
      <div style={{ marginTop: '20px' }}>
        <h3>Грузы в процессе доставки:</h3>
        <div style={{ maxHeight: '1000px', overflowY: 'auto', paddingRight: '10px' }}>
          <Row gutter={16}>
            {inProgressCargos.map(cargo => (
              <Col xs={24} key={cargo.id} style={{ marginBottom: '16px' }}>
                <Card title={cargo.name} bordered={true} style={{ width: '100%' }}>
                  <p>{cargo.details}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
