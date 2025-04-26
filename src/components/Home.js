import React from 'react';
import { Card } from 'antd';

const Home = () => {
    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <Card title="Chào mừng đến với Hệ thống Chẩn đoán Y tế" bordered={false}>
                <p>Hệ thống này giúp bạn chẩn đoán bệnh dựa trên các triệu chứng, quản lý danh sách bệnh, triệu chứng và thuốc.</p>
                <p>Hãy sử dụng các chức năng ở thanh điều hướng để bắt đầu!</p>
            </Card>
        </div>
    );
};

export default Home;