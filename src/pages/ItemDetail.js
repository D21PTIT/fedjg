import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Button, Space, Divider, Descriptions, notification, List, Rate, Form, Input } from 'antd';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircleOutlined, CloseCircleOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import './ItemDetail.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

const ItemDetail = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [form] = Form.useForm();

  // Fetch book details from the API
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8080/api/books/${itemId}/`);
        setBook(response.data);
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    };
    fetchBook();
  }, [itemId]);

  // Fetch comments for the item
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8080/api/comments/item/${itemId}/`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
    fetchComments();
  }, [itemId]);

  // Hàm tăng/giảm số lượng
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < book.stockQuantity) {
      setQuantity(quantity + 1);
    }
  };

  // Hàm thêm sản phẩm vào giỏ hàng
  const handleAddToCart = async () => {
    const customer = JSON.parse(localStorage.getItem('customer'));
    if (!customer || !customer.id) {
      notification.warning({
        message: 'Yêu cầu đăng nhập',
        description: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!',
        placement: 'topRight',
        duration: 3,
      });
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const cartId = `CART-${customer.id}`;
      await axios.post(`http://127.0.0.1:8080/api/carts/${cartId}/add-item/`, {
        itemId: book.itemId,
        quantity: quantity,
        price: book.price,
      });

      notification.open({
        message: 'Thêm vào giỏ hàng thành công',
        description: (
          <div>
            Sản phẩm <strong>{book.name}</strong> đã được thêm vào giỏ hàng!{' '}
            <Button
              type="link"
              onClick={() => navigate('/cart')}
              style={{ padding: 0 }}
            >
              Xem giỏ hàng
            </Button>
          </div>
        ),
        icon: <ShoppingCartOutlined style={{ color: '#52c41a', fontSize: '24px' }} />,
        placement: 'topRight',
        duration: 5,
        style: {
          backgroundColor: '#f6ffed',
          border: '1px solid #b7eb8f',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
        className: 'custom-notification',
      });
    } catch (error) {
      notification.error({
        message: 'Thêm vào giỏ hàng thất bại',
        description: error.response?.data?.error || 'Đã có lỗi xảy ra, vui lòng thử lại!',
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
        placement: 'topRight',
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  // Hàm gửi bình luận
  const handleSubmitComment = async (values) => {
    const customer = JSON.parse(localStorage.getItem('customer'));
    if (!customer || !customer.id) {
      notification.warning({
        message: 'Yêu cầu đăng nhập',
        description: 'Vui lòng đăng nhập để gửi bình luận!',
        placement: 'topRight',
        duration: 3,
      });
      navigate('/login');
      return;
    }

    setCommentLoading(true);
    try {
      const commentData = {
        commentId: `CMT${Date.now()}`,
        itemId: itemId,
        customerId: customer.id,
        content: values.content,
        rating: values.rating,
        isApproved: false,
      };

      const response = await axios.post('http://127.0.0.1:8080/api/comments/', commentData);
      setComments([...comments, response.data]);
      form.resetFields();

      notification.success({
        message: 'Gửi bình luận thành công',
        description: 'Bình luận của bạn đã được gửi và đang chờ phê duyệt!',
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        placement: 'topRight',
        duration: 3,
      });
    } catch (error) {
      notification.error({
        message: 'Gửi bình luận thất bại',
        description: error.response?.data?.error || 'Đã có lỗi xảy ra, vui lòng thử lại!',
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
        placement: 'topRight',
        duration: 3,
      });
    } finally {
      setCommentLoading(false);
    }
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div className="item-detail-container">
      <Row gutter={[32, 32]} align="middle">
        {/* Hình ảnh sản phẩm */}
        <Col xs={24} md={10}>
          <div className="item-image-container">
            <img
              src={book.imageLink || 'https://via.placeholder.com/300'}
              alt={book.name}
              style={{
                width: '100%',
                maxWidth: '400px',
                height: 'auto',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
            />
          </div>
        </Col>

        {/* Thông tin sản phẩm */}
        <Col xs={24} md={14}>
          <Title level={2} style={{ color: '#2c3e50', fontFamily: "'Playfair Display', serif", marginBottom: '8px' }}>
            {book.name}
          </Title>
          <Text style={{ fontSize: '16px', color: '#7f8c8d', fontFamily: "'Lora', serif", fontStyle: 'italic' }}>
            Tác giả: {book.author}
          </Text>
          <Divider style={{ margin: '12px 0' }} />

          {/* Giá và số lượng */}
          <Space direction="vertical" size="middle">
            <Text strong style={{ fontSize: '24px', color: '#e74c3c', fontFamily: "'Playfair Display', serif" }}>
              ${book.price.toFixed(2)}
            </Text>
            <Text style={{ fontSize: '14px', color: '#95a5a6' }}>
              Số lượng: {book.stockQuantity}
            </Text>

            {/* Thông tin vận chuyển */}
            <Text style={{ fontSize: '14px', color: '#2c3e50' }}>
              <strong>Thông tin vận chuyển</strong>
            </Text>
            <Text style={{ fontSize: '14px', color: '#7f8c8d' }}>
              Giao đến Q. Hoàn Kiếm, P. Hàng Trống, Hà Nội
            </Text>
            <Text style={{ fontSize: '14px', color: '#27ae60' }}>
              Giao Thứ Hai, 14/04: 23.000đ - 39.000đ
            </Text>
            <Text style={{ fontSize: '14px', color: '#3498db' }}>
              Freeship Xtra 15K đơn từ 45K, Freeship 70K đơn từ 100K
            </Text>

            {/* Số lượng và nút mua */}
            <Space>
              <Button onClick={handleDecrease} disabled={quantity <= 1}>-</Button>
              <Text style={{ fontSize: '16px', width: '40px', textAlign: 'center' }}>{quantity}</Text>
              <Button onClick={handleIncrease} disabled={quantity >= book.stockQuantity}>+</Button>
            </Space>
            <Space>
              <Button type="primary" size="large" style={{ backgroundColor: '#e74c3c', borderColor: '#e74c3c', borderRadius: '8px' }}>
                Mua ngay
              </Button>
              <Button
                size="large"
                style={{ borderRadius: '8px' }}
                onClick={handleAddToCart}
                loading={loading}
              >
                Thêm vào giỏ
              </Button>
            </Space>
          </Space>
        </Col>
      </Row>

      {/* Thông tin chi tiết */}
      <Divider orientation="left">
        <Title level={3} style={{ color: '#2c3e50', fontFamily: "'Playfair Display', serif" }}>
          Thông tin chi tiết
        </Title>
      </Divider>
      <Row>
        <Col span={24}>
          <Descriptions
            bordered
            column={1}
            labelStyle={{
              fontFamily: "'Lora', serif",
              fontWeight: 500,
              color: '#2c3e50',
              background: '#f7f7f7',
              padding: '12px',
              borderRadius: '8px 0 0 8px',
            }}
            contentStyle={{
              fontFamily: "'Lora', serif",
              color: '#34495e',
              background: '#fff',
              padding: '12px',
              borderRadius: '0 8px 8px 0',
            }}
            style={{
              background: '#fff',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            }}
          >
            <Descriptions.Item label="Mã sản phẩm">{book.itemId}</Descriptions.Item>
            <Descriptions.Item label="Thể loại">{book.genre}</Descriptions.Item>
            <Descriptions.Item label="Danh mục">{book.category}</Descriptions.Item>
            <Descriptions.Item label="Tác giả">{book.author}</Descriptions.Item>
            <Descriptions.Item label="Nhà xuất bản">{book.publisher}</Descriptions.Item>
            <Descriptions.Item label="Năm xuất bản">{book.publicationYear}</Descriptions.Item>
            <Descriptions.Item label="ISBN">{book.isbn}</Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">{book.createdDate}</Descriptions.Item>
            <Descriptions.Item label="Mô tả">{book.description}</Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>

      {/* Phần bình luận */}
      <Divider orientation="left">
        <Title level={3} style={{ color: '#2c3e50', fontFamily: "'Playfair Display', serif" }}>
          Bình luận
        </Title>
      </Divider>

      {/* Form gửi bình luận */}
      <Row>
        <Col span={24}>
          <Form
            form={form}
            onFinish={handleSubmitComment}
            layout="vertical"
            style={{ maxWidth: '600px', margin: '0 auto 20px' }}
          >
            <Form.Item
              label="Đánh giá"
              name="rating"
              rules={[{ required: true, message: 'Vui lòng chọn số sao đánh giá!' }]}
            >
              <Rate allowHalf />
            </Form.Item>
            <Form.Item
              label="Nội dung bình luận"
              name="content"
              rules={[{ required: true, message: 'Vui lòng nhập nội dung bình luận!' }]}
            >
              <TextArea rows={4} placeholder="Nhập nội dung bình luận của bạn..." />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={commentLoading}
                style={{ borderRadius: '8px' }}
              >
                Gửi bình luận
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>

      {/* Danh sách bình luận */}
      <Row>
        <Col span={24}>
          {comments.length === 0 ? (
            <Text style={{ display: 'block', textAlign: 'center', fontSize: '16px', color: '#7f8c8d' }}>
              Chưa có bình luận nào cho sản phẩm này.
            </Text>
          ) : (
            <List
              dataSource={comments}
              renderItem={(comment) => (
                <List.Item
                  style={{
                    background: '#fff',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '10px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Space>
                      <Text strong>{comment.customerId}</Text>
                      <Rate disabled value={comment.rating} allowHalf style={{ fontSize: '14px' }} />
                    </Space>
                    <Text>{comment.content}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {new Date(comment.commentDate).toLocaleString()}
                    </Text>
                  </Space>
                </List.Item>
              )}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ItemDetail;