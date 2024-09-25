import React from 'react';
import { Card, Col, Row } from 'antd';
import { StarFilled } from '@ant-design/icons';

const DashboardHome: React.FC = () => {
  const userName: string = "Иван";  // Имя пользователя
  const createdCargoCount: number = 3;
  const inProgressCargoCount: number = 1;
  const completedCargoCount: number = 5;
  const userScore: number = 95;

  // Пример данных для грузов в процессе доставки
  const inProgressCargos = [
    { id: 1, name: 'Груз 1', details: 'Детали груза 1' },
    { id: 2, name: 'Груз 2', details: 'Детали груза 2' },
    { id: 3, name: 'Груз 3', details: 'Детали груза 3' }
  ];

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

      {/* Прямоугольники для грузов в процессе доставки */}
      <div style={{ marginTop: '20px' }}>
        <h3>Грузы в процессе доставки:</h3>
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
  );
}

export default DashboardHome;
