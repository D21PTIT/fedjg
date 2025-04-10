import React from 'react';
import { Typography, Descriptions, Button, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CheckCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Profile = () => {
  const navigate = useNavigate();
  const customer = JSON.parse(localStorage.getItem('customer')) || {};

  if (!customer.id) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('customer');
    // Thông báo đăng xuất thành công
    notification.success({
      message: 'Đăng xuất thành công',
      description: 'Bạn đã đăng xuất khỏi hệ thống. Hẹn gặp lại!',
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      placement: 'topRight',
      duration: 3,
    });
    navigate('/');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #e8e8e8', borderRadius: '8px' }}>
      <Title level={2} style={{ textAlign: 'center' }}>Tài khoản cá nhân</Title>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">{customer.id}</Descriptions.Item>
        <Descriptions.Item label="Account ID">{customer.accountId}</Descriptions.Item>
        <Descriptions.Item label="Họ và tên">{customer.fullnameId}</Descriptions.Item>
        <Descriptions.Item label="Email">{customer.email}</Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">{customer.phone}</Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">{customer.addressId}</Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">{customer.createdAt}</Descriptions.Item>
        <Descriptions.Item label="Cập nhật gần nhất">{customer.updatedAt}</Descriptions.Item>
      </Descriptions>
      <Button
        type="primary"
        danger
        onClick={handleLogout}
        style={{ marginTop: '20px', width: '100%' }}
      >
        Đăng xuất
      </Button>
    </div>
  );
};

export default Profile;