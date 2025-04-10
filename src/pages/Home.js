import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Space, Divider, Tag, Typography } from 'antd';
import { useNavigate } from 'react-router-dom'; // Thêm useNavigate để chuyển hướng
import axios from 'axios';
import './Home.css';

const { Option } = Select;
const { Text, Title } = Typography;

const Home = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate(); // Hook để chuyển hướng

  // Fetch books from the API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8080/api/books/all/');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    fetchBooks();
  }, []);

  // Hàm xử lý khi nhấn vào sản phẩm
  const handleCardClick = (itemId) => {
    navigate(`/item/${itemId}`); // Chuyển hướng đến trang chi tiết
  };

  return (
    <div className="home-container">
      {/* Banner Section */}
      <div className="banner">
        <div className="banner-content">
          <h1>Grab Up to 50% Off On Selected Books</h1>
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <Space>
          <Select defaultValue="Category" style={{ width: 120 }}>
            <Option value="Programming">Programming</Option>
            <Option value="Fiction">Fiction</Option>
            <Option value="Educational">Educational</Option>
          </Select>
          <Select defaultValue="Price" style={{ width: 120 }}>
            <Option value="low-to-high">Low to High</Option>
            <Option value="high-to-low">High to Low</Option>
          </Select>
          <Select defaultValue="Genre" style={{ width: 120 }}>
            <Option value="Educational">Educational</Option>
            <Option value="Fiction">Fiction</Option>
            <Option value="Non-Fiction">Non-Fiction</Option>
          </Select>
        </Space>
        <Select defaultValue="Sort by" style={{ width: 120, float: 'right' }}>
          <Option value="relevance">Relevance</Option>
          <Option value="price-low">Price: Low to High</Option>
          <Option value="price-high">Price: High to Low</Option>
        </Select>
      </div>

      {/* Product List Section */}
      <Divider orientation="left">
        <Title level={2} style={{ color: '#2c3e50', fontWeight: 700 }}>
          Books For You!
        </Title>
      </Divider>
      <Row gutter={[32, 32]}>
        {books.map((book) => (
          <Col xs={24} sm={12} md={8} lg={6} key={book.itemId}>
            <Card
              hoverable
              onClick={() => handleCardClick(book.itemId)} // Thêm sự kiện onClick để chuyển hướng
              cover={
                <div className="book-image-container">
                  <img
                    alt={book.name}
                    src={book.imageLink || 'https://via.placeholder.com/150'}
                    style={{
                      height: 280,
                      width: '100%',
                      objectFit: 'cover',
                      borderTopLeftRadius: '12px',
                      borderTopRightRadius: '12px',
                    }}
                  />
                </div>
              }
              style={{
                borderRadius: '12px',
                border: 'none',
                background: '#fff',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                cursor: 'pointer', // Thêm con trỏ để người dùng biết có thể nhấn
              }}
              bodyStyle={{
                padding: '16px',
                background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
              }}
            >
              <Card.Meta
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong style={{ fontSize: '18px', color: '#2c3e50', fontFamily: "'Playfair Display', serif" }}>
                      {book.name}
                    </Text>
                    <Tag color="gold" style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '12px' }}>
                      {book.genre}
                    </Tag>
                  </div>
                }
                description={
                  <div>
                    <Text style={{ fontSize: '14px', color: '#7f8c8d', fontStyle: 'italic', fontFamily: "'Lora', serif" }}>
                      {book.author}
                    </Text>
                    <div style={{ marginTop: '8px' }}>
                      <Text strong style={{ fontSize: '16px', color: '#e74c3c', fontFamily: "'Playfair Display', serif" }}>
                        ${book.price.toFixed(2)}
                      </Text>
                    </div>
                    <Text style={{ fontSize: '12px', color: '#95a5a6', display: 'block', marginTop: '4px' }}>
                      In stock: {book.stockQuantity}
                    </Text>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Home;