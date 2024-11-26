// DashboardSelection.tsx
import React from 'react';
import { Card, Button, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import driverImage from '../driver.png'; // Путь к изображению водителя
import customerImage from '../customer.jpeg'; // Путь к изображению заказчика

const DashboardSelection: React.FC = () => {
  const navigate = useNavigate();

  // Обработчик для выхода
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Обработчик перехода в кабинеты
  const goToDashboard = (role: 'driver' | 'customer') => {
    navigate(`/${role}`);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: '100%', maxWidth: '600px', textAlign: 'center' }}>
        <Row gutter={16} justify="center">
          <Col span={12}>
            <Card
              hoverable
              onClick={() => goToDashboard('driver')}
              cover={<img alt="Кабинет Водителя" src={driverImage} style={{ height: '150px', objectFit: 'contain', marginTop: '10px'}} />}
              style={{ cursor: 'pointer', textAlign: 'center' }}
            >
              <Card.Meta title="Кабинет Водителя" description="Управляйте заказами и заявками" />
            </Card>
          </Col>
          <Col span={12}>
            <Card
              hoverable
              onClick={() => goToDashboard('customer')}
              cover={<img alt="Кабинет Заказчика" src={customerImage} style={{ height: '150px', objectFit: 'contain', marginTop: '10px' }} />}
              style={{ cursor: 'pointer', textAlign: 'center' }}
            >
              <Card.Meta title="Кабинет Заказчика" description="Управляйте грузами и отправками" />
            </Card>
          </Col>
        </Row>
        <Button type="primary" danger onClick={handleLogout} style={{ marginTop: '20px' }}>
          Выход
        </Button>
      </div>
    </div>
  );
};

export default DashboardSelection;
