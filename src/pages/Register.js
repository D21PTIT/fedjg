import React, { useState } from 'react';
import { Form, Input, Button, Typography, notification } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/customers/', {
        id: `CUST${Date.now()}`,
        accountId: `ACC${Date.now()}`,
        fullnameId: values.fullnameId,
        addressId: values.addressId,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });
      // Thông báo thành công
      notification.success({
        message: 'Đăng ký thành công',
        description: 'Tài khoản của bạn đã được tạo. Vui lòng đăng nhập để tiếp tục!',
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        placement: 'topRight',
        duration: 3,
      });
      navigate('/login'); // Chuyển hướng đến trang đăng nhập
    } catch (error) {
      // Thông báo thất bại
      notification.error({
        message: 'Đăng ký thất bại',
        description: error.response?.data?.error || 'Vui lòng kiểm tra thông tin và thử lại!',
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
      <Title level={2} style={{ textAlign: 'center' }}>Đăng ký</Title>
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Họ và tên"
          name="fullnameId"
          rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
        >
          <Input placeholder="Nhập họ và tên" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>
        <Form.Item
          label="Địa chỉ"
          name="addressId"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
        >
          <Input placeholder="Nhập địa chỉ" />
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
            Đăng ký
          </Button>
        </Form.Item>
        <div style={{ textAlign: 'center' }}>
          <span>Đã có tài khoản? </span>
          <Link to="/login">Đăng nhập ngay</Link>
        </div>
      </Form>
    </div>
  );
};

export default Register;