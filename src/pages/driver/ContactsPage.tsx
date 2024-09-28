import React from 'react';
import { Card, Typography, Space } from 'antd';
import { PhoneOutlined, MailOutlined, MessageOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';

const { Title, Text } = Typography;

const ContactsPage: React.FC = () => {
  return (
    <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
      <Card style={{ maxWidth: 400, width: '100%', textAlign: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <Title level={2}>Контакты</Title>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <PhoneOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
            <Text style={{ marginLeft: '10px', fontSize: '16px' }}>Телефон: +123456789</Text>
          </div>
          <div>
            <MailOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
            <Text style={{ marginLeft: '10px', fontSize: '16px' }}>Email: support@easycargobooking.com</Text>
          </div>
          <div>
            <MessageOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
            <Text style={{ marginLeft: '10px', fontSize: '16px' }}>Telegram: @support_bot</Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default ContactsPage;
