import React, { useState } from 'react';
import { Layout, Menu, Button, Drawer, Flex, Avatar, Card } from 'antd';
import { useNavigate, Route, Routes } from 'react-router-dom';
import { UserOutlined, FileTextOutlined, HistoryOutlined, PhoneOutlined, MenuOutlined } from '@ant-design/icons';
import DashboardHome from './DashboardHome';
import TripsPage from './TripsPage';
import ContactsPage from './ContactsPage';
import HistoryPage from './HistoryPage';
import '../../App.css';
import Title from 'antd/es/typography/Title';

const { Header, Sider, Content } = Layout;

function CustomerDashboard() {
  const navigate = useNavigate();
  const userName: string = "Иван"; // Имя пользователя
  const [visible, setVisible] = useState(false); // Состояние для видимости Drawer

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Сайдбар для десктопа */}
      <Sider theme="light" width={200}>
        <Card style={{ textAlign: 'center', margin: '8px', padding: '12px', maxWidth: '180px', width: '100%' }}>
          <Avatar size={48} icon={<UserOutlined />} />
          <Title level={5} style={{ marginTop: '12px' }}>Добро пожаловать, {userName}!</Title>
          <Button type="primary" size="small" style={{ marginTop: '6px' }} onClick={() => navigate('/customer/profile')}>
            Профиль
          </Button>
        </Card>
        <Menu
          mode="inline"
          defaultSelectedKeys={['/customer']}
          onClick={({ key }) => navigate(key)} // Переход по маршрутам
        >
          <Menu.Item key="/customer" icon={<UserOutlined />}>
            Главная
          </Menu.Item>
          <Menu.Item key="/customer/trips" icon={<FileTextOutlined />}>
            Поездки
          </Menu.Item>
          <Menu.Item key="/customer/history" icon={<HistoryOutlined />}>
            История
          </Menu.Item>
          <Menu.Item key="/customer/contacts" icon={<PhoneOutlined />}>
            Контакты
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header style={{ backgroundColor: '#fff', padding: '0 16px', alignItems: 'center' }}>
          {/* Кнопка для открытия Drawer на мобильных устройствах */}
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={showDrawer}
            style={{ fontSize: '24px', marginRight: '16px', marginTop: '15px' }} // Показываем кнопку на мобильных
            className="mobile-menu-button"
          />
        </Header>

        {/* Drawer для мобильных устройств */}
        <Drawer
          title={`Добро пожаловать, ${userName}!`} // Используем шаблонные строки
          placement="left"
          onClose={onClose}
          visible={visible}
          bodyStyle={{ padding: 0 }} // Убираем отступы в Drawer
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={['/customer']}
            onClick={({ key }) => {
              navigate(key);
              onClose(); // Закрыть Drawer после выбора
            }}
          >
            <Menu.Item key="/customer" icon={<UserOutlined />}>
              Главная
            </Menu.Item>
            <Menu.Item key="/customer/trips" icon={<FileTextOutlined />}>
              Поездки
            </Menu.Item>
            <Menu.Item key="/customer/history" icon={<HistoryOutlined />}>
              История
            </Menu.Item>
            <Menu.Item key="/customer/contacts" icon={<PhoneOutlined />}>
              Контакты
            </Menu.Item>
          </Menu>
        </Drawer>

        <Content style={{ margin: '16px', padding: '24px', backgroundColor: 'white' }}>
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default CustomerDashboard;
