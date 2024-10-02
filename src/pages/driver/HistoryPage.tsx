import React, { useState } from 'react';
import { Table, Card, Typography, Drawer, Descriptions, Button, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import 'antd/dist/reset.css';

interface Cargo {
  id: number;
  status: string;
  from: string;
  to: string;
  date: string;
}

const { Title } = Typography;

const HistoryPage: React.FC = () => {
  const [cargoHistory, setCargoHistory] = useState<Cargo[]>([
    { id: 1, status: 'Забронирован', from: 'Москва', to: 'Питер', date: '2023-09-15' },
    { id: 2, status: 'В пути', from: 'Казань', to: 'Уфа', date: '2023-09-20' },
    { id: 3, status: 'Завершено', from: 'Сочи', to: 'Москва', date: '2023-08-30' },
  ]);

  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedCargo, setSelectedCargo] = useState<Cargo | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'Забронирован' | 'В пути' | 'Завершено'>('Забронирован');

  const showDrawer = (cargo: Cargo) => {
    setSelectedCargo(cargo);
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
  };

  const completeCargo = (id: number) => {
    setCargoHistory(prevHistory => 
      prevHistory.map(cargo => 
        cargo.id === id ? { ...cargo, status: 'Завершено' } : cargo
      )
    );
    message.success('Груз успешно завершен!');
  };

  const confirmCargo = (id: number) => {
    setCargoHistory(prevHistory => 
      prevHistory.map(cargo => 
        cargo.id === id ? { ...cargo, status: 'В пути' } : cargo
      )
    );
    message.success('Груз успешно подтвержден и теперь в пути!');
  };

  const columns: ColumnsType<Cargo> = [
    {
      title: 'Откуда',
      dataIndex: 'from',
      key: 'from',
    },
    {
      title: 'Куда',
      dataIndex: 'to',
      key: 'to',
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <span style={{ color: status === 'В пути' ? 'orange' : status === 'Завершено' ? 'green' : 'blue' }}>{status}</span>,
    },
    {
      title: 'Дата',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Действия',
      key: 'action',
      render: (_, cargo) => (
        cargo.status === 'В пути' ? (
          <Button onClick={() => completeCargo(cargo.id)} type="primary">Завершить</Button>
        ) : cargo.status === 'Забронирован' ? (
          <Button onClick={() => confirmCargo(cargo.id)} type="primary">Подтвердить</Button>
        ) : null
      ),
    },
  ];

  const filteredCargos = cargoHistory.filter(cargo => cargo.status === selectedCategory);

  return (
    <div style={{ padding: '20px' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center' }}>История грузов</Title>
        
        {/* Кнопки для переключения между категориями */}
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <Button onClick={() => setSelectedCategory('Забронирован')} style={{ marginRight: '10px' }}>
            Забронированные грузы
          </Button>
          <Button onClick={() => setSelectedCategory('В пути')} style={{ marginRight: '10px' }}>
            В пути
          </Button>
          <Button onClick={() => setSelectedCategory('Завершено')}>
            Завершенные грузы
          </Button>
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
        width={400}
      >
        {selectedCargo && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Откуда">{selectedCargo.from}</Descriptions.Item>
            <Descriptions.Item label="Куда">{selectedCargo.to}</Descriptions.Item>
            <Descriptions.Item label="Статус">
              <span style={{ color: selectedCargo.status === 'В пути' ? 'orange' : selectedCargo.status === 'Завершено' ? 'green' : 'blue' }}>
                {selectedCargo.status}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Дата">{selectedCargo.date}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
};

export default HistoryPage;
