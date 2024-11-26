import React, { useEffect, useState } from 'react';
import { Drawer, Card, List, Typography, message, Button, Modal, Form, Input, InputNumber, Select, Checkbox, DatePicker } from 'antd';
import axios from 'axios';
import { BACKEND_URL } from '../../config/config';
import countryData from '../../eurasia_countries_and_cities_ru.json';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;

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
  weight: number;
  price: number;
  distance: number;
  cargoType: string;
  length?: number;
  width?: number;
  height?: number;
  paymentMethod: string;
  advancePaymentPercentage?: number;
  advancePaymentMethod?: string;
  currency: string;
  roundTrip: boolean;
  routes: Route[];
  customer: string;
  executor?: string;
  carBody: string;
  workType: string;
  status: string;
  customerStatus: string;
  driverStatus: string;
  carType: string;
  min: number;
  max: number;
  adr: string;
  nds: string;
  telegram: string;
  pnumber: string;
  tripType: string;
}

const UserUnbookedCargos = () => {
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [selectedCargo, setSelectedCargo] = useState<Cargo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);

  useEffect(() => {
    fetchUnbookedCargos();
  }, []);

  const fetchUnbookedCargos = async () => {
    setLoading(true);
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    const back = BACKEND_URL;

    try {
      const response = await axios.get(`${back}/api/orders/unbooked/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const cargosWithCountryData = response.data.map((cargo: Cargo) => ({
        ...cargo,
        routes: cargo.routes.map(route => ({
          ...route,
          ...getCountryInfo(route.countryFrom, 'From'),
          ...getCountryInfo(route.countryTo, 'To')
        }))
      }));

      setCargos(cargosWithCountryData);
    } catch (error) {
      console.error('Ошибка при получении незабронированных грузов:', error);
      message.error('Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  const getCountryInfo = (countryCode: string, direction: 'From' | 'To') => {
    const country = countryData.countries.find((c: any) => c.countryCode === countryCode);
    if (country) {
      return direction === 'From'
        ? { flagUrlFrom: country.flagUrl, countryNameFrom: country.name }
        : { flagUrlTo: country.flagUrl, countryNameTo: country.name };
    }
    return {};
  };

  const showDrawer = (cargo: Cargo) => {
    setSelectedCargo(cargo);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setSelectedCargo(null);
  };

  const handleEditCargo = async (values: Partial<Cargo>) => {
    if (!selectedCargo) return;
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`${BACKEND_URL}/api/orders/${selectedCargo.id}`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Груз успешно обновлен');
      setCargos((prev) =>
        prev.map((cargo) => (cargo.id === selectedCargo.id ? { ...cargo, ...response.data } : cargo))
      );
      setEditModalVisible(false);
    } catch (error) {
      console.error('Ошибка при обновлении груза:', error);
      message.error('Не удалось обновить груз');
    }
  };

  const handleDeleteCargo = async () => {
    if (!selectedCargo) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${BACKEND_URL}/api/orders/${selectedCargo.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Груз успешно удален');
      setCargos((prev) => prev.filter((cargo) => cargo.id !== selectedCargo.id));
      closeDrawer();
    } catch (error) {
      console.error('Ошибка при удалении груза:', error);
      message.error('Не удалось удалить груз');
    }
  };

  return (
    <div>
      {cargos.map((cargo) => (
        <div
          key={cargo.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 20px',
            borderBottom: '1px solid #f0f0f0',
            cursor: 'pointer',
            width: '100%',
            backgroundColor: '#fafafa',
          }}
          onClick={() => showDrawer(cargo)}
        >
          <Text>
            <img src={cargo.routes[0].flagUrlFrom} alt={cargo.routes[0].countryNameFrom} style={{ width: '20px', marginRight: '5px' }} />
            {cargo.routes[0].countryNameFrom} ({cargo.routes[0].countryFrom}), {cargo.routes[0].cityFrom} →{' '}
            <img src={cargo.routes[cargo.routes.length - 1].flagUrlTo} alt={cargo.routes[cargo.routes.length - 1].countryNameTo} style={{ width: '20px', marginRight: '5px' }} />
            {cargo.routes[cargo.routes.length - 1].countryNameTo} ({cargo.routes[cargo.routes.length - 1].countryTo}), {cargo.routes[cargo.routes.length - 1].cityTo}
          </Text>
          <Text>Вес: {cargo.weight} кг</Text>
          <Text>Стоимость: {cargo.price} $</Text>
        </div>
      ))}

      <Drawer
        title="Детали груза"
        placement="right"
        closable={true}
        onClose={closeDrawer}
        visible={drawerVisible}
        width={400}
      >
        {selectedCargo && (
          <>
            <Text strong>Маршруты:</Text>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '8px', border: '1px solid #ddd' }}>Отправление</th>
                  <th style={{ textAlign: 'left', padding: '8px', border: '1px solid #ddd' }}>Назначение</th>
                </tr>
              </thead>
              <tbody>
                {selectedCargo.routes.map((route, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                    {index === 0 ? (
                      <>
                        <td style={{ padding: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img src={route.flagUrlFrom} alt={route.countryNameFrom} style={{ width: '20px', marginRight: '8px' }} />
                            <Text>{route.countryNameFrom} ({route.countryFrom}), {route.cityFrom}, {route.addressFrom}</Text>
                          </div>
                        </td>
                        <td style={{ padding: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img src={route.flagUrlTo} alt={route.countryNameTo} style={{ width: '20px', marginRight: '8px' }} />
                            <Text>{route.countryNameTo} ({route.countryTo}), {route.cityTo}, {route.addressTo}</Text>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: '8px' }}></td> {/* Empty cell for "From" */}
                        <td style={{ padding: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img src={route.flagUrlTo} alt={route.countryNameTo} style={{ width: '20px', marginRight: '8px' }} />
                            <Text>{route.countryNameTo} ({route.countryTo}), {route.cityTo}, {route.addressTo}</Text>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>


            <div style={{ marginTop: 20 }}>
              <Text strong>ID груза:</Text> {selectedCargo.id}<br />
              <Text strong>Дата начала:</Text> {selectedCargo.startDate}<br />
              {selectedCargo.endDate && (
                <>
                  <Text strong>Дата окончания:</Text> {selectedCargo.endDate}<br />
                </>
              )}
              <Text strong>Вес:</Text> {selectedCargo.weight} кг<br />
              <Text strong>Стоимость:</Text> {selectedCargo.price} {selectedCargo.currency}<br />
              <Text strong>Расстояние:</Text> {selectedCargo.distance} км<br />
              <Text strong>Тип груза:</Text> {selectedCargo.cargoType}<br />
              <Text strong>Габариты (ДxШxВ):</Text> {selectedCargo.length ?? '—'} x {selectedCargo.width ?? '—'} x {selectedCargo.height ?? '—'}<br />
              <Text strong>Способ оплаты:</Text> {selectedCargo.paymentMethod}<br />
              {selectedCargo.advancePaymentPercentage && (
                <>
                  <Text strong>Авансовый платеж:</Text> {selectedCargo.advancePaymentPercentage}% ({selectedCargo.advancePaymentMethod})<br />
                </>
              )}
              <Text strong>Тип кузова:</Text> {selectedCargo.carBody}<br />
              <Text strong>Тип работы:</Text> {selectedCargo.workType}<br />
              <Text strong>Статус:</Text> {selectedCargo.status}<br />
              <Text strong>Мин. температура:</Text> {selectedCargo.min} <br />
              <Text strong>Макс. температура:</Text> {selectedCargo.max} <br />
              <Text strong>ADR:</Text> {selectedCargo.adr}<br />
              <Text strong>НДС:</Text> {selectedCargo.nds}<br />
              <Text strong>Телеграм:</Text> {selectedCargo.telegram}<br />
              <Text strong>Номер телефона:</Text> {selectedCargo.pnumber}<br />
              <Text strong>Тип поездки:</Text> {selectedCargo.tripType}<br />
              {selectedCargo.executor && (
                <>
                  <Text strong>Исполнитель:</Text> {selectedCargo.executor}<br />
                </>
              )}
            </div>

            <div style={{ marginTop: 20 }}>
              <Button type="primary" onClick={() => setEditModalVisible(true)} style={{ marginRight: '10px' }}>
                Изменить
              </Button>
              <Button type="primary" danger onClick={handleDeleteCargo}>
                Удалить
              </Button>
            </div>
          </>
        )}
      </Drawer>

      <Modal
        title="Изменить груз"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        <Form initialValues={selectedCargo ? { ...selectedCargo, startDate: moment(selectedCargo.startDate), endDate: selectedCargo.endDate ? moment(selectedCargo.endDate) : undefined } : undefined} onFinish={handleEditCargo}>
          <Form.Item label="Дата начала" name="startDate">
            <DatePicker />
          </Form.Item>
          <Form.Item label="Вес" name="weight">
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Стоимость" name="price">
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Расстояние" name="distance">
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Тип груза" name="cargoType">
            <Input />
          </Form.Item>
          <Form.Item label="Длина" name="length">
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Ширина" name="width">
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Высота" name="height">
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Способ оплаты" name="paymentMethod">
            <Select>
              <Option value="Наличные">Наличные</Option>
              <Option value="Карта">Карта</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Процент предоплаты" name="advancePaymentPercentage">
            <InputNumber min={0} max={100} />
          </Form.Item>
          <Form.Item label="Тип кузова" name="carBody">
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Сохранить изменения
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default UserUnbookedCargos;
