import React, { useState, useEffect } from 'react';
import { Layout, Image } from 'antd';
import { BrowserRouter as Router, Route, Routes, useNavigate, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import DriverDashboard from './pages/driver/DriverDashboard';
import './App.css';
import MenuComponent from './component/MenuComponent';
import MainPage from './pages/MainPage';
import DashboardSelection from './pages/DashboardSelection';

const { Header } = Layout;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Указываем тип состояния
  const navigate = useNavigate();

  // Проверяем авторизацию при каждом изменении localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const handleLogin = () => {
    // Логика проверки логина
    // Если логин успешен, выполняем переход:
    navigate('/login'); // Здесь переходим на страницу логина
  };


  return (
    <Layout className="main">
      <Header className="header-container" style={{ backgroundColor: "#1677ff" }}>
        <div className="container">
          <div className="logo" style={{ float: 'left', color: 'white', fontSize: '24px' }}>
            <Link to="/" style={{ color: 'white' }}>Cargo Booking</Link>
          </div>
          <MenuComponent isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        </div>
      </Header>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/select-dashboard" element={<DashboardSelection />} />
        <Route path="/customer/*" element={<CustomerDashboard />} />
        <Route path="/driver/*" element={<DriverDashboard />} />
      </Routes>
    </Layout>

  );
}

export default App;
