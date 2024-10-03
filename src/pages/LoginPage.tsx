import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      const response = await axios.post('http://localhost:5050/api/users/login', {
        phoneNumber: values.username, // Мы отправляем номер телефона как phoneNumber
        password: values.password,
      });

      // Сохраняем ID пользователя и роль в localStorage
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('userId', response.data.userId); // Сохраняем ID пользователя
      localStorage.setItem('role', response.data.role); // Сохраняем роль

      message.success('Успешный вход');

      // Переход на страницу в зависимости от роли
      if (response.data.role === 'Заказчик') {
        navigate('/customer');
      } else if (response.data.role === 'Водитель') {
        navigate('/driver');
      }

    } catch (error) {
      message.error('Ошибка при входе. Проверьте данные.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f0f2f5'
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
