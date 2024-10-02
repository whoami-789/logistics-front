import React, { useState } from 'react';
import { Card, Col, Row, Modal } from 'antd';
import { StarFilled } from '@ant-design/icons';

const DashboardHome: React.FC = () => {
  const [visibleIncome, setVisibleIncome] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const availableCargos = [
    { country: 'Узбекистан', count: 12 },
    { country: 'Казахстан', count: 15 },
    { country: 'Россия', count: 8 },
    { country: 'Беларусь', count: 10 },
  ];

  const userIncome = [
    { month: 'Январь', amount: 1200 },
    { month: 'Февраль', amount: 1100 },
    { month: 'Март', amount: 1500 },
    { month: 'Апрель', amount: 1300 },
    { month: 'Май', amount: 1400 },
    { month: 'Июнь', amount: 1600 },
    { month: 'Июль', amount: 1550 },
    { month: 'Август', amount: 1700 },
    { month: 'Сентябрь', amount: 1800 },
    { month: 'Октябрь', amount: 1900 },
    { month: 'Ноябрь', amount: 2000 },
    { month: 'Декабрь', amount: 2100 },
  ];

  const userScore: number = 8; // Оценка по 10-балльной шкале

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
    setSelectedCountry('Все'); // Можно изменить, чтобы показать все страны
  };

  return (
    <div style={{ padding: '20px' }}>
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
              {availableCargos.reduce((total, cargo) => total + cargo.count, 0)} грузов
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
              {userIncome[userIncome.length - 1].amount} ₽
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

      {/* Модальное окно для доходов за последние 12 месяцев */}
      <Modal title="Доходы за последние 12 месяцев" visible={visibleIncome} onCancel={handleCancelIncome} footer={null}>
        <ul>
          {userIncome.map((income) => (
            <li key={income.month}>
              {income.month}: {income.amount} ₽
            </li>
          ))}
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
          {availableCargos.map((cargo) => (
            <li key={cargo.country}>
              {cargo.count} грузов из {cargo.country}
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
}

export default DashboardHome;
