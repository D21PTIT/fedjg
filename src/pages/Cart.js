import React, { useState, useEffect } from 'react';
import { Table, Button, Typography, Space, notification, Divider } from 'antd';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [cartSummary, setCartSummary] = useState({ totalPrice: 0, totalQuantity: 0 });
  const [loading, setLoading] = useState(false);

  // Kiểm tra trạng thái đăng nhập và lấy cartId
  const customer = JSON.parse(localStorage.getItem('customer'));
  const cartId = customer ? `CART-${customer.id}` : null;

  // Fetch cart items
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!cartId) {
        notification.warning({
          message: 'Yêu cầu đăng nhập',
          description: 'Vui lòng đăng nhập để xem giỏ hàng!',
          placement: 'topRight',
          duration: 3,
        });
        navigate('/login');
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`http://127.0.0.1:8080/api/carts/${cartId}/items/`);
        setCartItems(response.data);

        // Tính tổng giá và tổng số lượng
        const totalPrice = response.data.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const totalQuantity = response.data.reduce((sum, item) => sum + item.quantity, 0);
        setCartSummary({ totalPrice, totalQuantity });
      } catch (error) {
        notification.error({
          message: 'Không tải được giỏ hàng',
          description: error.response?.data?.error || 'Đã có lỗi xảy ra, vui lòng thử lại!',
          icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
          placement: 'topRight',
          duration: 3,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCartItems();
  }, [cartId, navigate]);

  // Hàm tăng/giảm số lượng
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 0) return;

    setLoading(true);
    try {
      const response = await axios.put(
        `http://127.0.0.1:8080/api/carts/${cartId}/update-quantity/${itemId}/`, // Sửa endpoint
        { quantity: newQuantity }
      );

      // Cập nhật danh sách sản phẩm
      setCartItems(response.data.items);

      // Cập nhật tổng giá và tổng số lượng
      const totalPrice = response.data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const totalQuantity = response.data.items.reduce((sum, item) => sum + item.quantity, 0);
      setCartSummary({ totalPrice, totalQuantity });

      notification.success({
        message: 'Cập nhật số lượng thành công',
        description: `Số lượng sản phẩm đã được cập nhật!`,
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        placement: 'topRight',
        duration: 3,
      });
    } catch (error) {
      notification.error({
        message: 'Cập nhật số lượng thất bại',
        description: error.response?.data?.error || 'Đã có lỗi xảy ra, vui lòng thử lại!',
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
        placement: 'topRight',
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  // Hàm xóa sản phẩm khỏi giỏ hàng
  const handleRemoveItem = async (itemId) => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8080/api/carts/${cartId}/remove-item/${itemId}/` // Sửa endpoint
      );

      // Cập nhật danh sách sản phẩm
      setCartItems(response.data.items);

      // Cập nhật tổng giá và tổng số lượng
      const totalPrice = response.data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const totalQuantity = response.data.items.reduce((sum, item) => sum + item.quantity, 0);
      setCartSummary({ totalPrice, totalQuantity });

      notification.success({
        message: 'Xóa sản phẩm thành công',
        description: `Sản phẩm đã được xóa khỏi giỏ hàng!`,
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        placement: 'topRight',
        duration: 3,
      });
    } catch (error) {
      notification.error({
        message: 'Xóa sản phẩm thất bại',
        description: error.response?.data?.error || 'Đã có lỗi xảy ra, vui lòng thử lại!',
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
        placement: 'topRight',
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  // Cột của bảng
  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'itemId',
      key: 'itemId',
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => (
        <Space>
          <Button onClick={() => handleUpdateQuantity(record.itemId, quantity - 1)} disabled={quantity <= 1}>-</Button>
          <Text>{quantity}</Text>
          <Button onClick={() => handleUpdateQuantity(record.itemId, quantity + 1)}>+</Button>
        </Space>
      ),
    },
    {
      title: 'Thành tiền',
      key: 'total',
      render: (record) => `$${(record.price * record.quantity).toFixed(2)}`,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (record) => (
        <Button type="link" danger onClick={() => handleRemoveItem(record.itemId)}>
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '40px', backgroundColor: '#f7f7f7', minHeight: '100vh' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>
        Giỏ hàng của bạn
      </Title>

      {cartItems.length === 0 ? (
        <Text style={{ display: 'block', textAlign: 'center', fontSize: '16px', color: '#7f8c8d' }}>
          Giỏ hàng của bạn đang trống. <RouterLink to="/">Tiếp tục mua sắm</RouterLink>
        </Text>
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={cartItems}
            rowKey="itemId"
            pagination={false}
            loading={loading}
            style={{ marginBottom: '20px' }}
          />

          <Divider />

          <div style={{ textAlign: 'right' }}>
            <Space direction="vertical" size="middle">
              <Text strong style={{ fontSize: '16px' }}>
                Tổng số lượng: {cartSummary.totalQuantity}
              </Text>
              <Text strong style={{ fontSize: '18px', color: '#e74c3c' }}>
                Tổng tiền: ${cartSummary.totalPrice.toFixed(2)}
              </Text>
              <Button
                type="primary"
                size="large"
                style={{ backgroundColor: '#e74c3c', borderColor: '#e74c3c', borderRadius: '8px' }}
                onClick={() => alert('Chức năng thanh toán đang được phát triển!')}
              >
                Thanh toán
              </Button>
            </Space>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;