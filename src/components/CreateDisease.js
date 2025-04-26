import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Select, Button, Table, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const CreateDisease = () => {
    const [form] = Form.useForm();
    const [symptoms, setSymptoms] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [diseases, setDiseases] = useState([]);

    // Lấy danh sách triệu chứng, thuốc và bệnh khi component mount
    useEffect(() => {
        fetchSymptoms();
        fetchMedicines();
        fetchDiseases();
    }, []);

    const fetchSymptoms = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8080/api/doctor/symptoms');
            setSymptoms(response.data);
        } catch (error) {
            message.error('Lỗi khi lấy danh sách triệu chứng: ' + error.message);
        }
    };

    const fetchMedicines = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8080/api/doctor/medicines');
            setMedicines(response.data);
        } catch (error) {
            message.error('Lỗi khi lấy danh sách thuốc: ' + error.message);
        }
    };

    const fetchDiseases = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8080/api/diagnosis/diseases');
            setDiseases(response.data);
        } catch (error) {
            message.error('Lỗi khi lấy danh sách bệnh: ' + error.message);
        }
    };

    const onFinish = async (values) => {
        try {
            const response = await axios.post('http://127.0.0.1:8080/api/doctor/add-disease', values);
            message.success('Bệnh đã được tạo thành công!');
            form.resetFields();
            fetchDiseases(); // Cập nhật danh sách sau khi tạo
        } catch (error) {
            message.error('Lỗi: ' + (error.response?.data?.detail || error.message));
        }
    };

    const columns = [
        { title: 'Tên bệnh', dataIndex: 'name', key: 'name' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description' },
        { title: 'Mức độ', dataIndex: 'severity', key: 'severity' },
        {
            title: 'Triệu chứng',
            key: 'disease_symptoms',
            render: (_, record) => (
                record.disease_symptoms.map(ds => ds.symptom.name).join(', ')
            ),
        },
        {
            title: 'Thuốc',
            key: 'disease_medicines',
            render: (_, record) => (
                record.disease_medicines.map(dm => dm.medicine.name).join(', ')
            ),
        },
    ];

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center' }}>Tạo Bệnh</h2>
            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
                initialValues={{ severity: 'mild' }}
            >
                <Form.Item
                    label="Tên bệnh"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên bệnh!' }]}
                >
                    <Input placeholder="Nhập tên bệnh" />
                </Form.Item>
                <Form.Item label="Mô tả" name="description">
                    <Input placeholder="Nhập mô tả bệnh" />
                </Form.Item>
                <Form.Item
                    label="Mức độ nghiêm trọng"
                    name="severity"
                    rules={[{ required: true, message: 'Vui lòng chọn mức độ!' }]}
                >
                    <Select>
                        <Option value="mild">Không nghiêm trọng</Option>
                        <Option value="moderate">Trung bình</Option>
                        <Option value="severe">Nguy hiểm</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Triệu chứng"
                    name="symptom_ids"
                    rules={[{ required: true, message: 'Vui lòng chọn ít nhất một triệu chứng!' }]}
                >
                    <Select mode="multiple" placeholder="Chọn triệu chứng">
                        {symptoms.map(symptom => (
                            <Option key={symptom.id} value={symptom.id}>
                                {symptom.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Thuốc"
                    name="medicine_ids"
                    rules={[{ required: true, message: 'Vui lòng chọn ít nhất một thuốc!' }]}
                >
                    <Select mode="multiple" placeholder="Chọn thuốc">
                        {medicines.map(medicine => (
                            <Option key={medicine.id} value={medicine.id}>
                                {medicine.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                        Tạo Bệnh
                    </Button>
                </Form.Item>
            </Form>
            <h3>Danh sách bệnh</h3>
            <Table
                dataSource={diseases}
                columns={columns}
                rowKey="name"
                pagination={false}
                bordered
            />
        </div>
    );
};

export default CreateDisease;