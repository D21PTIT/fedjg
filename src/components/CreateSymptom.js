import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, InputNumber, Button, Table, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const CreateSymptom = () => {
    const [form] = Form.useForm();
    const [symptoms, setSymptoms] = useState([]);

    // Lấy danh sách triệu chứng khi component mount
    useEffect(() => {
        fetchSymptoms();
    }, []);

    const fetchSymptoms = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8080/api/doctor/symptoms');
            setSymptoms(response.data);
        } catch (error) {
            message.error('Lỗi khi lấy danh sách triệu chứng: ' + error.message);
        }
    };

    const onFinish = async (values) => {
        try {
            const response = await axios.post('http://127.0.0.1:8080/api/doctor/add-symptom', values);
            message.success('Triệu chứng đã được tạo thành công! ID: ' + response.data.id);
            form.resetFields();
            fetchSymptoms(); // Cập nhật danh sách sau khi tạo
        } catch (error) {
            message.error('Lỗi: ' + (error.response?.data?.detail || error.message));
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Tên triệu chứng', dataIndex: 'name', key: 'name' },
        { title: 'Câu hỏi', dataIndex: 'question_text', key: 'question_text' },
        { title: 'Ưu tiên', dataIndex: 'priority', key: 'priority' },
    ];

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center' }}>Tạo Triệu Chứng</h2>
            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
                initialValues={{ priority: 1 }}
            >
                <Form.Item
                    label="Tên triệu chứng"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên triệu chứng!' }]}
                >
                    <Input placeholder="Nhập tên triệu chứng" />
                </Form.Item>
                <Form.Item
                    label="Câu hỏi"
                    name="question_text"
                    rules={[{ required: true, message: 'Vui lòng nhập câu hỏi!' }]}
                >
                    <Input placeholder="Nhập câu hỏi" />
                </Form.Item>
                <Form.Item
                    label="Ưu tiên (Priority)"
                    name="priority"
                    rules={[{ required: true, message: 'Vui lòng nhập ưu tiên!' }]}
                >
                    <InputNumber min={1} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                        Tạo Triệu Chứng
                    </Button>
                </Form.Item>
            </Form>
            <h3>Danh sách triệu chứng</h3>
            <Table
                dataSource={symptoms}
                columns={columns}
                rowKey="id"
                pagination={false}
                bordered
            />
        </div>
    );
};

export default CreateSymptom;