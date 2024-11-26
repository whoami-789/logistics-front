import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Card, Typography, Drawer, Descriptions, Button, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import 'antd/dist/reset.css';
import { BACKEND_URL } from '../../config/config';
import countryData from '../../eurasia_countries_and_cities_ru.json';


const { Text } = Typography;


interface Route {
  countryFrom: string;
  cityFrom: string;
  addressFrom: string;
  countryTo: string;
  cityTo: string;
  addressTo: string;
  flagUrlFrom?: string;
  countryNameFrom?: string;
  flagUrlTo?: string;
  countryNameTo?: string;
}

interface Cargo {
  id: number;
  startDate: string;
  endDate?: string;
  weight: number | null;
  price: number | null;
  distance: number | null;
  cargoType: string;
  length?: number;
  width?: number;
  height?: number;
  paymentMethod: string;
  advancePaymentPercentage?: number;
  advancePaymentMethod?: string;
  currency: string;
  roundTrip: boolean | null;
  routes: Route[];
  customer: string;
  executor?: string;
  carBody: string;
  workType: string | null;
  status: string;
  customerStatus: string | null;
  driverStatus: string;
  carType: string | null;
  min: number | null;
  max: number | null;
  adr: string;
  nds: string;
  telegram: string;
  pnumber: string;
  tripType: string | null;
}

const { Title } = Typography;

const HistoryPage: React.FC = () => {
  const [cargoHistory, setCargoHistory] = useState<Cargo[]>([]);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedCargoDetails, setSelectedCargo] = useState<Cargo | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string[]>(['Ожидает подтверждения', 'Забронирован']);
  const back = BACKEND_URL;

  const fetchTrips = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(`${back}/api/orders/customer/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCargoHistory(response.data);
    } catch (error) {
      console.error('Error fetching trips: ', error);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const showDrawer = (cargo: Cargo) => {
    setSelectedCargo(cargo);
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
  };

  const columns: ColumnsType<Cargo> = [
    {
      title: 'Маршрут',
      key: 'route',
      render: (_, cargo) => (
        <div>
          {cargo.routes.map((route, index) => (
            <div key={index}>
              <img
                src={route.flagUrlFrom || `https://flagcdn.com/w40/${route.countryFrom.toLowerCase()}.png`}
                alt={route.countryFrom}
                style={{ marginRight: 8 }}
              />
              {route.cityFrom}, {route.addressFrom} →{' '}
              <img
                src={route.flagUrlTo || `https://flagcdn.com/w40/${route.countryTo.toLowerCase()}.png`}
                alt={route.countryTo}
                style={{ marginRight: 8 }}
              />
              {route.cityTo}, {route.addressTo}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Вес (кг)',
      dataIndex: 'weight',
      key: 'weight',
      render: (weight) => (weight ? weight : 'Не указан'),
    },
    {
      title: 'Цена',
      dataIndex: 'price',
      key: 'price',
      render: (price, cargo) => (price ? `${price} ${cargo.currency}` : 'Не указана'),
    },
    {
      title: 'Тип кузова',
      dataIndex: 'carBody',
      key: 'carBody',
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'В пути' ? 'orange' : status === 'Завершено' ? 'green' : 'blue'}>
          {status}
        </Tag>
      ),
    },
  ];

  const filteredCargos = cargoHistory.filter((cargo) => selectedCategory.includes(cargo.status));

  const handleConfirmOrder = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${back}/api/orders/status/customer/${selectedCargoDetails?.id}?status=Забронирован`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        // Обновляем статус заказа на "Забронирован"
        const updatedOrder = await response.json();
        setSelectedCargo(updatedOrder);
        fetchTrips();
      } else {
        alert('Не удалось подтвердить заказ');
      }
    } catch (error) {
      console.error('Ошибка при подтверждении заказа:', error);
    }
  };

  const handleRejectOrder = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${back}/api/orders/status/customer/${selectedCargoDetails?.id}?status=Отменено`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,

        },
      });
  
      if (response.ok) {
        // Обновляем статус заказа на "Отклонено"
        const updatedOrder = await response.json();
        setSelectedCargo(updatedOrder);
        fetchTrips();
      } else {
        alert('Не удалось отклонить заказ');
      }
    } catch (error) {
      console.error('Ошибка при отклонении заказа:', error);
    }
  };

  const handleCompleteOrder = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${back}/api/orders/status/driver/${selectedCargoDetails?.id}?status=Доставлен}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,

        },
      });
  
      if (response.ok) {
        // Обновляем статус заказа на "Доставлен"
        const updatedOrder = await response.json();
        setSelectedCargo(updatedOrder);
        fetchTrips();
      } else {
        alert('Не удалось завершить заказ');
      }
    } catch (error) {
      console.error('Ошибка при завершении заказа:', error);
    }
  };
  
  

  return (
    <div style={{ padding: '20px' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center' }}>История грузов</Title>

        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <Button onClick={() => setSelectedCategory(['Ожидает подтверждения', 'Забронирован'])} style={{ marginRight: '10px' }}>
            Забронированные грузы
          </Button>
          <Button onClick={() => setSelectedCategory(['В пути'])} style={{ marginRight: '10px' }}>
            В пути
          </Button>
          <Button onClick={() => setSelectedCategory(['Завершено'])}>Завершенные грузы</Button>
        </div>

        <Table
          dataSource={filteredCargos}
          columns={columns}
          rowKey="id"
          pagination={false}
          bordered
          onRow={(cargo) => ({
            onClick: () => showDrawer(cargo),
          })}
        />
      </Card>

      <Drawer
        title="Детали груза"
        placement="right"
        onClose={closeDrawer}
        open={isDrawerVisible}
        width={800} // Увеличено для расширения Drawer влево
      >
        {selectedCargoDetails && (
          <>
            {/* Маршруты */}
            <Text strong>Маршруты:</Text>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '8px', border: '1px solid #ddd' }}>Отправление</th>
                  <th style={{ textAlign: 'left', padding: '8px', border: '1px solid #ddd' }}>Назначение</th>
                </tr>
              </thead>
              <tbody>
                {selectedCargoDetails.routes.map((route, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                    {index === 0 ? (
                      <>
                        <td style={{ padding: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img
                              src={route.flagUrlFrom || `https://flagcdn.com/w40/${route.countryFrom.toLowerCase()}.png`}
                              alt={route.countryNameFrom || route.countryFrom}
                              style={{ width: '20px', marginRight: '8px' }}
                              onError={(e) => (e.currentTarget.src = '/fallback-flag.png')} // Резервный флаг
                            />
                            <Text>
                              {route.countryNameFrom || route.countryFrom}, {route.cityFrom}, {route.addressFrom}
                            </Text>
                          </div>
                        </td>
                        <td style={{ padding: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img
                              src={route.flagUrlTo || `https://flagcdn.com/w40/${route.countryTo.toLowerCase()}.png`}
                              alt={route.countryNameTo || route.countryTo}
                              style={{ width: '20px', marginRight: '8px' }}
                              onError={(e) => (e.currentTarget.src = '/fallback-flag.png')} // Резервный флаг
                            />
                            <Text>
                              {route.countryNameTo || route.countryTo}, {route.cityTo}, {route.addressTo}
                            </Text>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: '8px' }}></td> {/* Пустая ячейка для "Отправления" */}
                        <td style={{ padding: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img
                              src={route.flagUrlTo || `https://flagcdn.com/w40/${route.countryTo.toLowerCase()}.png`}
                              alt={route.countryNameTo || route.countryTo}
                              style={{ width: '20px', marginRight: '8px' }}
                              onError={(e) => (e.currentTarget.src = '/fallback-flag.png')} // Резервный флаг
                            />
                            <Text>
                              {route.countryNameTo || route.countryTo}, {route.cityTo}, {route.addressTo}
                            </Text>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>

                ))}
              </tbody>
            </table>

            {/* Данные о грузе */}
            <div style={{ marginTop: 20 }}>
              <div style={{ marginBottom: 20 }}>
                <Text strong style={{ fontSize: '16px' }}>О грузе</Text><br />
                <Text strong>ID груза:</Text> {selectedCargoDetails.id}<br />
                <Text strong>Дата начала:</Text> {selectedCargoDetails.startDate}<br />
                {selectedCargoDetails.endDate && (
                  <>
                    <Text strong>Дата окончания:</Text> {selectedCargoDetails.endDate}<br />
                  </>
                )}
                <Text strong>Вес:</Text> {selectedCargoDetails.weight} кг<br />
                <Text strong>Тип груза:</Text> {selectedCargoDetails.cargoType}<br />
                <Text strong>Габариты (ДxШxВ):</Text> {selectedCargoDetails.length ?? '—'} x {selectedCargoDetails.width ?? '—'} x {selectedCargoDetails.height ?? '—'}<br />
                <Text strong>Тип работы:</Text> {selectedCargoDetails.workType}<br />
                <Text strong>Тип поездки:</Text> {selectedCargoDetails.tripType}<br />
              </div>

              <div style={{ marginBottom: 20 }}>
                <Text strong style={{ fontSize: '16px' }}>Транспорт</Text><br />
                <Text strong>Тип кузова:</Text> {selectedCargoDetails.carBody}<br />
                <Text strong>Мин. температура:</Text> {selectedCargoDetails.min}<br />
                <Text strong>Макс. температура:</Text> {selectedCargoDetails.max}<br />
                <Text strong>ADR:</Text> {selectedCargoDetails.adr}<br />
              </div>

              <div style={{ marginBottom: 20 }}>
                <Text strong style={{ fontSize: '16px' }}>Оплата</Text><br />
                <Text strong>Стоимость:</Text> {selectedCargoDetails.price} {selectedCargoDetails.currency}<br />
                <Text strong>Способ оплаты:</Text> {selectedCargoDetails.paymentMethod}<br />
                {selectedCargoDetails.advancePaymentPercentage && (
                  <>
                    <Text strong>Авансовый платеж:</Text> {selectedCargoDetails.advancePaymentPercentage}% ({selectedCargoDetails.advancePaymentMethod})<br />
                  </>
                )}
                <Text strong>НДС:</Text> {selectedCargoDetails.nds}<br />
              </div>
            </div>

            {/* Контакты */}
            {selectedCargoDetails.status === "Забронирован" && (
              <div style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)' }}>
                <Text strong style={{ fontSize: '16px' }}>Контакты</Text><br />
                <Text strong>Телеграм:</Text> {selectedCargoDetails.telegram}<br />
                <Text strong>Номер телефона:</Text> {selectedCargoDetails.pnumber}<br />
              </div>
            )}

            {/* Кнопки */}
            <div style={{ marginTop: 20, textAlign: 'right' }}>
              {selectedCargoDetails.status === "Ожидает подтверждения" && (
                <>
                  <Button type="primary" onClick={handleConfirmOrder} style={{ marginRight: '10px' }}>
                    Подтвердить
                  </Button>
                  <Button danger onClick={handleRejectOrder}>
                    Отклонить
                  </Button>
                </>
              )}
              {selectedCargoDetails.status === "В пути" && (
                <Button type="primary" onClick={handleCompleteOrder}>
                  Завершить
                </Button>
              )}
            </div>
          </>
        )}
      </Drawer>

    </div>
  );
};

export default HistoryPage;
