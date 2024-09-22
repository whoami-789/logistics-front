import React from 'react';
import { Form, Input, Button, Select, message, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { FaTelegramPlane } from 'react-icons/fa';
import '../App.css';
import { getData } from 'country-list';

const RegisterPage: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [modalMessage, setModalMessage] = React.useState('');

    const onFinish = async (values: { firstName: string; lastName: string; phoneNumber: string; country: string; password: string; role: string }) => {
        const payload = {
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNumber: values.phoneNumber,
            country: values.country,
            password: values.password,
            role: { id: Number(values.role) },
        };
        console.log('Отправляемые данные:', payload);

        try {
            const response = await fetch('http://localhost:5050/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            // Проверяем Content-Type, чтобы решить, как обрабатывать ответ
            const contentType = response.headers.get('Content-Type');

            let data;
            if (contentType && contentType.includes('application/json')) {
                // Если ответ в формате JSON
                data = await response.json();
            } else {
                // Если ответ текстовый
                data = await response.text();
            }

            console.log('Response data:', data); // Вывод данных, независимо от формата

            if (response.ok) {
                // Устанавливаем сообщение для модального окна
                setModalMessage(data);
                setIsModalVisible(true);
            } else {
                console.error('Error response:', data); // Вывод ошибки в случае некорректного ответа
                message.error(data || 'Произошла ошибка при регистрации');
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('Произошла ошибка при регистрации');
        }
    };

    const countries = getData().map(country => ({
        value: country.code,
        label: country.name,
    }));

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f0f2f5'
        }}>
            <div style={{ maxWidth: '400px', width: '100%' }}>
                <h2 style={{ textAlign: 'center' }}>Регистрация</h2>
                <Form
                    name="register"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="firstName"
                        label="Имя"
                        rules={[{ required: true, message: 'Пожалуйста, введите имя!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="lastName"
                        label="Фамилия"
                        rules={[{ required: true, message: 'Пожалуйста, введите фамилию!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="phoneNumber"
                        label="Номер телефона"
                        rules={[{ required: true, message: 'Пожалуйста, введите номер телефона!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="country"
                        label="Страна"
                        rules={[{ required: true, message: 'Пожалуйста, выберите страну!' }]}
                    >
                        <Select
                            options={countries}
                            placeholder="Выберите страну"
                        />
                    </Form.Item>
                    <Form.Item
                        name="role"
                        label="Ваша роль на сервисе"
                        rules={[{ required: true, message: 'Пожалуйста, выберите роль!' }]}
                    >
                        <Select
                            options={[
                                { value: '1', label: 'Заказчик' },
                                { value: '2', label: 'Водитель' },
                            ]}
                            placeholder="Выберите роль"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Пароль"
                        rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="confirm"
                        label="Подтвердите пароль"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Пожалуйста, подтвердите пароль!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Пароли не совпадают!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Зарегистрироваться
                        </Button>
                    </Form.Item>
                </Form>
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <Link to="/login">Уже есть аккаунт? Войти!</Link>
                </div>
            </div>

            <Modal
                visible={isModalVisible}
                onOk={() => setIsModalVisible(false)}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="ok" onClick={() => setIsModalVisible(false)}>
                        ОК
                    </Button>,
                ]}
            >
                <div style={{ textAlign: 'center' }}>
                    <FaTelegramPlane style={{ fontSize: '48px', color: '#0088cc' }} />
                    <p>
                        {modalMessage.split(' ').map((word, i) =>
                            word.startsWith('https://') ? (
                                <a key={i} href={word} target="_blank" rel="noopener noreferrer">
                                    {word}
                                </a>
                            ) : (
                                word + ' '
                            )
                        )}
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default RegisterPage;
