import React from 'react';
import { Form, Input, Button } from 'antd';
import { Link } from 'react-router-dom';
import '../App.css'; // Подключи файл стилей

const LoginPage: React.FC = () => {
  const onFinish = (values: { username: string; password: string }) => {
    console.log('Received values:', values);
    // Здесь можно добавить логику для аутентификации
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      backgroundColor: '#f0f2f5' // светлый фон
    }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <h2 style={{ textAlign: 'center' }}>Вход</h2>
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="Номер телефона"
            rules={[{ required: true, message: 'Пожалуйста, введите номер телефона!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Пароль"
            rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Войти
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <Link to="/register">Еще не с нами? Зарегистрируйтесь!</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
