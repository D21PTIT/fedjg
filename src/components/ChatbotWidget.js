import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, message, List, Radio } from 'antd';
import { RobotOutlined, CloseOutlined } from '@ant-design/icons';

const ChatbotWidget = ({ visible, toggleVisible }) => {
    const [sessionId, setSessionId] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [currentQuestionId, setCurrentQuestionId] = useState(null);
    const [conversation, setConversation] = useState([]);
    const [diagnosis, setDiagnosis] = useState(null);
    const [answer, setAnswer] = useState(null);

    useEffect(() => {
        if (visible && !sessionId) {
            startSession();
        }
    }, [visible]);

    const startSession = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8080/api/chatbot/start-session', {
                user_id: "test_user"
            });
            setSessionId(response.data.session_id);
            setCurrentQuestion(response.data.question);
            setCurrentQuestionId(response.data.question_id);
            setConversation([{ question: response.data.question, answer: null }]);
            setDiagnosis(null);
            setAnswer(null);
        } catch (error) {
            message.error('Lỗi khi bắt đầu phiên chatbot: ' + error.message);
        }
    };

    const handleAnswer = async () => {
        if (!answer) {
            message.warning('Vui lòng chọn câu trả lời!');
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8080/api/chatbot/submit-answer', {
                session_id: sessionId,
                question_id: currentQuestionId,
                answer: answer
            });

            if (response.data.diagnosis) {
                setDiagnosis(response.data.diagnosis);
                setConversation([...conversation, { question: currentQuestion, answer }]);
                setCurrentQuestion(null);
                setCurrentQuestionId(null);
            } else {
                setCurrentQuestion(response.data.question);
                setCurrentQuestionId(response.data.question_id);
                setConversation([...conversation, { question: currentQuestion, answer }]);
                setAnswer(null);
            }
        } catch (error) {
            message.error('Lỗi khi gửi câu trả lời: ' + error.message);
        }
    };

    const handleRestart = () => {
        startSession();
    };

    const handleClose = () => {
        setSessionId(null);
        setCurrentQuestion(null);
        setCurrentQuestionId(null);
        setConversation([]);
        setDiagnosis(null);
        setAnswer(null);
        toggleVisible();
    };

    if (!visible) return null;

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '80px',
                right: '20px',
                width: '350px',
                height: '450px',
                background: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <div
                style={{
                    background: '#1890ff',
                    color: '#fff',
                    padding: '10px',
                    borderTopLeftRadius: '8px',
                    borderTopRightRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <span><RobotOutlined /> Chatbot Chẩn đoán</span>
                <CloseOutlined onClick={handleClose} style={{ cursor: 'pointer' }} />
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
                <List
                    dataSource={conversation}
                    renderItem={(item, index) => (
                        <List.Item>
                            <List.Item.Meta
                                title={`Câu hỏi ${index + 1}: ${item.question}`}
                                description={item.answer ? `Trả lời: ${item.answer === 'yes' ? 'Có' : 'Không'}` : 'Chưa trả lời'}
                            />
                        </List.Item>
                    )}
                />
                {diagnosis && (
                    <div style={{ marginTop: '10px', padding: '10px', background: '#e6f7ff', borderRadius: '5px' }}>
                        <h4>Kết quả chẩn đoán:</h4>
                        <p><strong>Bệnh:</strong> {diagnosis.disease}</p>
                        <p><strong>Thuốc điều trị:</strong></p>
                        <ul>
                            {diagnosis.medicines.map((med, index) => (
                                <li key={index}>
                                    {med.medicine.name} - {med.medicine.dosage}
                                    {med.medicine.contraindications && ` (Chống chỉ định: ${med.medicine.contraindications})`}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <div style={{ padding: '10px', borderTop: '1px solid #f0f0f0' }}>
                {currentQuestion && !diagnosis && (
                    <>
                        <h4>{currentQuestion}</h4>
                        <Radio.Group onChange={(e) => setAnswer(e.target.value)} value={answer}>
                            <Radio value="yes">Có</Radio>
                            <Radio value="no">Không</Radio>
                        </Radio.Group>
                        <div style={{ marginTop: '10px' }}>
                            <Button type="primary" onClick={handleAnswer}>
                                Gửi
                            </Button>
                        </div>
                    </>
                )}
                {diagnosis && (
                    <Button type="primary" onClick={handleRestart}>
                        Bắt đầu lại
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ChatbotWidget;