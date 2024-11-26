import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button, Drawer, Flex, Avatar, Card, message } from 'antd';
import { useNavigate, Route, Routes } from 'react-router-dom';
import { UserOutlined, FileTextOutlined, HistoryOutlined, PhoneOutlined, MenuOutlined } from '@ant-design/icons';
import DashboardHome from './DashboardHome';
import TripsPage from './TripsPage';
import ContactsPage from './ContactsPage';
import HistoryPage from './HistoryPage';
import '../../App.css';
import Title from 'antd/es/typography/Title';
import axios from 'axios';
import UserUnbookedCargos from './UserUnbookedCargos';
import { BACKEND_URL } from '../../config/config';


const { Header, Sider, Content } = Layout;

interface User {
  id: number;
  firstName: string;
  email: string;
  phoneNumber: string;
  // Добавьте другие поля, которые приходят из запроса
}

function CustomerDashboard() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false); // Состояние для видимости Drawer
  const [user, setUser] = useState<User | null>(null); // Состояние для пользователя


  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const back = BACKEND_URL;

    if (!userId || !token) {
      message.error('Пользователь или токен не найдены');
      return;
    }

    // Запрос на получение данных пользователя
    axios.get(`${back}/api/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        const userData: User = response.data; // Приводим к типу User
        setUser(userData); // Сохраняем данные пользователя
      })
      .catch(error => {
        message.error('Ошибка при получении данных пользователя');
      });
  }, []);


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
          <Menu.Item key="/customer/unbroned-trips" icon={<FileTextOutlined />}>
            Свободные грузы
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
          title={`Добро пожаловать, ${user ? user.firstName : 'Гость'}!`} // Используем шаблонные строки
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
            <Menu.Item key="/customer/unbroned-trips" icon={<FileTextOutlined />}>
              Свободные грузы
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
            <Route path="/unbroned-trips" element={<UserUnbookedCargos />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default CustomerDashboard;
