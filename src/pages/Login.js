import React, { useState } from 'react';
import { Form, Input, Button, Typography, notification } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/users/login/', {
        email: values.email,
        password: values.password,
      });
      // Lưu thông tin khách hàng vào localStorage
      localStorage.setItem('customer', JSON.stringify(response.data.customer));
      // Thông báo thành công
      notification.success({
        message: 'Đăng nhập thành công',
        description: `Chào mừng ${response.data.customer.fullnameId} đã quay lại!`,
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        placement: 'topRight',
        duration: 3,
      });
      navigate('/'); // Chuyển hướng về trang chủ
    } catch (error) {
      // Thông báo thất bại
      notification.error({
        message: 'Đăng nhập thất bại',
        description: error.response?.data?.error || 'Vui lòng kiểm tra email và mật khẩu!',
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
        placement: 'topRight',
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #e8e8e8', borderRadius: '8px' }}>
      <Title level={2} style={{ textAlign: 'center' }}>Đăng nhập</Title>
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Đăng nhập
          </Button>
        </Form.Item>
        <div style={{ textAlign: 'center' }}>
          <span>Chưa có tài khoản? </span>
          <Link to="/register">Đăng ký ngay</Link>
        </div>
      </Form>
    </div>
  );
};

export default Login;