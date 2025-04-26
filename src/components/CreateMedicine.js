import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Button, Table, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const CreateMedicine = () => {
    const [form] = Form.useForm();
    const [medicines, setMedicines] = useState([]);

    // Lấy danh sách thuốc khi component mount
    useEffect(() => {
        fetchMedicines();
    }, []);

    const fetchMedicines = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8080/api/doctor/medicines');
            setMedicines(response.data);
        } catch (error) {
            message.error('Lỗi khi lấy danh sách thuốc: ' + error.message);
        }
    };

    const onFinish = async (values) => {
        try {
            const response = await axios.post('http://127.0.0.1:8080/api/doctor/add-medicine', values);
            message.success('Thuốc đã được tạo thành công! ID: ' + response.data.id);
            form.resetFields();
            fetchMedicines(); // Cập nhật danh sách sau khi tạo
        } catch (error) {
            message.error('Lỗi: ' + (error.response?.data?.detail || error.message));
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Tên thuốc', dataIndex: 'name', key: 'name' },
        { title: 'Liều lượng', dataIndex: 'dosage', key: 'dosage' },
        { title: 'Dạng bào chế', dataIndex: 'form', key: 'form' },
        { title: 'Chống chỉ định', dataIndex: 'contraindications', key: 'contraindications' },
    ];

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center' }}>Tạo Thuốc</h2>
            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
            >
                <Form.Item
                    label="Tên thuốc"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên thuốc!' }]}
                >
                    <Input placeholder="Nhập tên thuốc" />
                </Form.Item>
                <Form.Item label="Liều lượng" name="dosage">
                    <Input placeholder="Nhập liều lượng (ví dụ: 500mg, 2 lần/ngày)" />
                </Form.Item>
                <Form.Item label="Dạng bào chế" name="form">
                    <Input placeholder="Nhập dạng bào chế (ví dụ: tablet)" />
                </Form.Item>
                <Form.Item label="Chống chỉ định" name="contraindications">
                    <Input placeholder="Nhập chống chỉ định (nếu có)" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                        Tạo Thuốc
                    </Button>
                </Form.Item>
            </Form>
            <h3>Danh sách thuốc</h3>
            <Table
                dataSource={medicines}
                columns={columns}
                rowKey="id"
                pagination={false}
                bordered
            />
        </div>
    );
};

export default CreateMedicine;