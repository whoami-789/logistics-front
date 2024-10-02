import React from 'react';
import { Layout, Menu } from 'antd';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './App.css'; // Подключи файл стилей
import CustomerDashboard from './pages/customer/CustomerDashboard';
import DriverDashboard from './pages/driver/DriverDashboard';

const { Header } = Layout;

function App() {
  return (
    <Router>
      <Layout className="main">
        <Header className="header-container" style={{ backgroundColor: "#1677ff" }}>
          <div className="container">
            <div className="logo" style={{ float: 'left', color: 'white', fontSize: '24px' }}>
              <Link to="/" style={{ color: 'white' }}>Easy Cargobooking</Link>
            </div>
            <Menu theme="light" mode="horizontal" style={{ float: 'right', backgroundColor: "#1677ff" }} selectedKeys={[]}>
              <Menu.Item key="1" style={{ fontSize: 23 }} className='menu-item'>
                <Link to="/login" style={{ color: 'white' }}>Войти</Link>
              </Menu.Item>
            </Menu>
          </div>
        </Header>
        <div className="content">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/customer/*" element={<CustomerDashboard />} /> {/* Здесь изменено на "/*" */}
            <Route path="/driver/*" element={<DriverDashboard />} /> {/* Здесь изменено на "/*" */}
          </Routes>
        </div>
      </Layout>
    </Router>
  );
}

export default App;
