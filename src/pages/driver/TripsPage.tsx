import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, InputNumber, DatePicker, Row, Col, Divider, Table } from 'antd';
import axios from 'axios';
import { Dayjs } from 'dayjs';

const { Option } = Select;

interface Filters {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  weight: number | null;
  price: number | null;
  distance: number | null;
  workType?: string;
  locationFrom?: string;
  locationTo?: string;
  bodyType?: string;
}

const TripsPage: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    startDate: null,
    endDate: null,
    weight: null,
    price: null,
    distance: null,
  });

  const [trips, setTrips] = useState<any[]>([]);

  const handleFilterChange = (changedValues: any) => {
    setFilters((prev) => ({ ...prev, ...changedValues }));
    fetchFilteredTrips({ ...filters, ...changedValues });
  };

  const fetchFilteredTrips = async (filterParams: any) => {
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(filterParams).filter(([_, v]) => v != null)
      );
      const response = await axios.post('/api/trips/filter', filteredParams);
      setTrips(response.data);
    } catch (error) {
      console.error("Error fetching trips: ", error);
    }
  };

  const columns = [
    {
      title: 'Дата начала',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'Страна отправления',
      dataIndex: 'countryFrom',
      key: 'countryFrom',
    },
    {
      title: 'Место отправления',
      dataIndex: 'locationFrom',
      key: 'locationFrom',
    },
    {
      title: 'Страна назначения',
      dataIndex: 'countryTo',
      key: 'countryTo',
    },
    {
      title: 'Место назначения',
      dataIndex: 'locationTo',
      key: 'locationTo',
    },
    {
      title: 'Вес (тонн)',
      dataIndex: 'weight',
      key: 'weight',
    },
    {
      title: 'Расстояние (км)',
      dataIndex: 'distance',
      key: 'distance',
    },
    {
      title: 'Цена ($)',
      dataIndex: 'price',
      key: 'price',
    },
  ];

  const fetchTrips = async () => {
    try {
      const response = await axios.get('/api/trips');
      setTrips(response.data);
    } catch (error) {
      console.error("Error fetching trips: ", error);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h2>Доступные грузы</h2>

      <Form layout="vertical" onValuesChange={handleFilterChange}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Тип работы">
              <Select value={filters.workType} onChange={(value) => setFilters((prev) => ({ ...prev, workType: value }))}>
                <Option value="one-way">Односторонняя поездка</Option>
                <Option value="round-trip">Поездка туда и обратно</Option>
                <Option value="multi-stop">Многостоповая поездка</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Место загрузки">
              <Input value={filters.locationFrom} onChange={(e) => setFilters((prev) => ({ ...prev, locationFrom: e.target.value }))} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Место разгрузки">
              <Input value={filters.locationTo} onChange={(e) => setFilters((prev) => ({ ...prev, locationTo: e.target.value }))} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Дата начала">
              <DatePicker
                style={{ width: '100%' }}
                onChange={(date) => setFilters((prev) => ({ ...prev, startDate: date }))}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Дата окончания">
              <DatePicker
                style={{ width: '100%' }}
                onChange={(date) => setFilters((prev) => ({ ...prev, endDate: date }))}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Вес груза (тонн)">
              <InputNumber
                min={0}
                onChange={(value) => setFilters((prev) => ({ ...prev, weight: value }))}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Цена ($)">
              <InputNumber
                min={0}
                onChange={(value) => setFilters((prev) => ({ ...prev, price: value }))}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Расстояние (км)">
              <InputNumber
                min={0}
                onChange={(value) => setFilters((prev) => ({ ...prev, distance: value }))}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Тип кузова">
              <Select value={filters.bodyType} onChange={(value) => setFilters((prev) => ({ ...prev, bodyType: value }))}>
                <Option value="tent">Тентованный</Option>
                <Option value="open">Открытый</Option>
                <Option value="refrigerator">Рефрижератор</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Divider />
      <h3>Сортировка</h3>
      <Button onClick={() => setTrips([...trips].sort((a, b) => b.price - a.price))}>По цене (убывание)</Button>
      <Button onClick={() => setTrips([...trips].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()))}>По дате (ближайшие)</Button>

      <Divider />
      <Table dataSource={trips} columns={columns} rowKey="id" />
    </div>
  );
};

export default TripsPage;
