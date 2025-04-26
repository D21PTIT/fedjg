import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import CreateDisease from './components/CreateDisease';
import CreateMedicine from './components/CreateMedicine';
import CreateSymptom from './components/CreateSymptom';
import ChatbotWidget from './components/ChatbotWidget';
import Home from './components/Home';

const { Header, Content } = Layout;

function App() {
    const [chatbotVisible, setChatbotVisible] = useState(false);

    return (
        <Router>
            <Layout>
                <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                        <Menu.Item key="1">
                            <Link to="/">Trang chủ</Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Link to="/create-disease">Tạo Bệnh</Link>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Link to="/create-medicine">Tạo Thuốc</Link>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <Link to="/create-symptom">Tạo Triệu Chứng</Link>
                        </Menu.Item>
                    </Menu>
                </Header>
                <Content style={{ padding: '0 50px', marginTop: 64 }}>
                    <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>
                        <Routes>
                            <Route path="/create-disease" element={<CreateDisease />} />
                            <Route path="/create-medicine" element={<CreateMedicine />} />
                            <Route path="/create-symptom" element={<CreateSymptom />} />
                            <Route path="/" element={<Home />} />
                        </Routes>
                    </div>
                </Content>
                <div
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        zIndex: 1000,
                        cursor: 'pointer',
                    }}
                    onClick={() => setChatbotVisible(!chatbotVisible)}
                >
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
                        alt="Chatbot"
                        style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            backgroundColor: '#1890ff',
                            padding: '5px'
                        }}
                    />
                </div>
                <ChatbotWidget visible={chatbotVisible} toggleVisible={() => setChatbotVisible(!chatbotVisible)} />
            </Layout>
        </Router>
    );
}

export default App;