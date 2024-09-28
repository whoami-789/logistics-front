import React, { useState } from 'react';
import { Table, Card, Typography, Drawer, Descriptions } from 'antd';
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
  const cargoHistory: Cargo[] = [
    { id: 1, status: 'Завершено', from: 'Москва', to: 'Питер', date: '2023-09-15' },
    { id: 2, status: 'В пути', from: 'Казань', to: 'Уфа', date: '2023-09-20' }
  ];

  // Состояние для открытия Drawer и хранения выбранного заказа
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedCargo, setSelectedCargo] = useState<Cargo | null>(null);

  const showDrawer = (cargo: Cargo) => {
    setSelectedCargo(cargo);
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
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
      render: (status) => <span style={{ color: status === 'В пути' ? 'orange' : 'green' }}>{status}</span>,
    },
    {
      title: 'Дата',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center' }}>История грузов</Title>
        <Table
          dataSource={cargoHistory}
          columns={columns}
          rowKey="id"
          pagination={false}
          bordered
          // Добавляем обработчик клика по строке
          onRow={(cargo) => ({
            onClick: () => showDrawer(cargo), // Открываем Drawer с выбранным заказом
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
              <span style={{ color: selectedCargo.status === 'В пути' ? 'orange' : 'green' }}>
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
