import { Menu, Badge, Dropdown, Space, notification } from 'antd';
import { SearchOutlined, ShoppingCartOutlined, MenuOutlined, UserOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import axios from 'axios';
import { useState, useEffect } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const [cartQuantity, setCartQuantity] = useState(0);

  // Kiểm tra trạng thái đăng nhập từ localStorage
  const isLoggedIn = !!localStorage.getItem('customer');
  const customer = JSON.parse(localStorage.getItem('customer')) || {};

  // Lấy số lượng sản phẩm trong giỏ hàng
  useEffect(() => {
    const fetchCartQuantity = async () => {
      if (isLoggedIn && customer.id) {
        try {
          const cartId = `CART-${customer.id}`;
          const response = await axios.get(`http://127.0.0.1:8080/api/carts/${cartId}/items/`);
          const items = response.data;
          const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
          setCartQuantity(totalQuantity);
        } catch (error) {
          console.error('Error fetching cart quantity:', error);
        }
      }
    };
    fetchCartQuantity();
  }, [isLoggedIn, customer.id]);

  // Hàm đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('customer');
    setCartQuantity(0); // Reset số lượng giỏ hàng
    notification.success({
      message: 'Đăng xuất thành công',
      description: 'Bạn đã đăng xuất khỏi hệ thống. Hẹn gặp lại!',
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      placement: 'topRight',
      duration: 3,
    });
    navigate('/');
  };

  // Dropdown menu
  const userMenu = (
    <Menu>
      {isLoggedIn ? (
        <>
          <Menu.Item key="profile">
            <Link to="/profile">Tài khoản cá nhân</Link>
          </Menu.Item>
          <Menu.Item key="logout" onClick={handleLogout}>
            Đăng xuất
          </Menu.Item>
        </>
      ) : (
        <>
          <Menu.Item key="login">
            <Link to="/login">Đăng nhập</Link>
          </Menu.Item>
          <Menu.Item key="register">
            <Link to="/register">Đăng ký</Link>
          </Menu.Item>
        </>
      )}
    </Menu>
  );

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 50px', borderBottom: '1px solid #e8e8e8' }}>
      {/* Logo */}
      <div>
        <Link to="/">
          <img src={logo} alt="MIMOSA" style={{ height: '30px' }} />
        </Link>
      </div>

      {/* Menu */}
      <Menu mode="horizontal" style={{ borderBottom: 'none', flex: 1, justifyContent: 'center' }}>
        <Menu.Item key="home">
          <Link to="/">Trang chủ</Link>
        </Menu.Item>
        <Menu.Item key="item">
          <Link to="/item">
            Sản phẩm <span style={{ color: 'red', fontSize: '12px', verticalAlign: 'top' }}>NEW</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="order">
          <Link to="/order">Đơn hàng</Link>
        </Menu.Item>
        <Menu.Item key="contact">
          <Link to="/contact">Về chúng tôi</Link>
        </Menu.Item>
      </Menu>

      {/* Icons */}
      <Space size="large">
        <SearchOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
        <Badge count={cartQuantity} showZero>
          <ShoppingCartOutlined style={{ fontSize: '20px', cursor: 'pointer' }} onClick={() => navigate('/cart')} />
        </Badge>
        <Dropdown overlay={userMenu} trigger={['click']}>
          <UserOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
        </Dropdown>
        <MenuOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
      </Space>
    </div>
  );
};

export default Header;