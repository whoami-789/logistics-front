import React from 'react';
import { Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

interface MenuComponentProps {
  isLoggedIn: boolean;
  handleLogout: () => void;
}

const MenuComponent: React.FC<MenuComponentProps> = ({ isLoggedIn, handleLogout }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRoleSelection = () => {
    navigate('/select-dashboard'); // Перенаправляем на страницу выбора роли
  };

  return (
    <Menu
      theme="light"
      mode="horizontal"
      style={{
        float: 'right',
        backgroundColor: "#1677ff",
        border: 'none',
        lineHeight: '64px',
      }}
      selectedKeys={[]}
    >
      {!isLoggedIn ? (
        <Menu.Item key="login" style={{ fontSize: 20, padding: '0 40px', minWidth: '150px' }}>
          <Link to="/login" style={{ color: 'white' }} onClick={handleLogin}>Войти</Link>
        </Menu.Item>
      ) : (
        <Menu.Item key="role-selection" style={{ fontSize: 20, padding: '0 40px', minWidth: '150px' }} onClick={handleRoleSelection}>
          <span style={{ color: 'white' }}>Выбор роли</span>
        </Menu.Item>
      )}
    </Menu>
  );
};

export default MenuComponent;
