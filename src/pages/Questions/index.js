import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getData, postData, putData } from '../../services/productService';
import { useSelector } from 'react-redux';
import "./Quetions.scss";
import { FcPrevious } from "react-icons/fc";
import { Spin } from 'antd';
import Icon from '@ant-design/icons';
function Questions() {
    const PandaSvg = () => (
        <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
            <title>Panda icon</title>
            <path
                d="M99.096 315.634s-82.58-64.032-82.58-132.13c0-66.064 33.032-165.162 148.646-148.646 83.37 11.91 99.096 165.162 99.096 165.162l-165.162 115.614zM924.906 315.634s82.58-64.032 82.58-132.13c0-66.064-33.032-165.162-148.646-148.646-83.37 11.91-99.096 165.162-99.096 165.162l165.162 115.614z"
                fill="#6B676E"
            />
            <path
                d="M1024 561.548c0 264.526-229.23 429.42-512.002 429.42S0 826.076 0 561.548 283.96 66.064 512.002 66.064 1024 297.022 1024 561.548z"
                fill="#FFEBD2"
            />
            <path
                d="M330.324 842.126c0 82.096 81.34 148.646 181.678 148.646s181.678-66.55 181.678-148.646H330.324z"
                fill="#E9D7C3"
            />
            <path
                d="M644.13 611.098C594.582 528.516 561.55 512 512.002 512c-49.548 0-82.58 16.516-132.13 99.096-42.488 70.814-78.73 211.264-49.548 247.742 66.064 82.58 165.162 33.032 181.678 33.032 16.516 0 115.614 49.548 181.678-33.032 29.18-36.476-7.064-176.93-49.55-247.74z"
                fill="#FFFFFF"
            />
            <path
                d="M611.098 495.484c0-45.608 36.974-82.58 82.58-82.58 49.548 0 198.194 99.098 198.194 165.162s-79.934 144.904-148.646 99.096c-49.548-33.032-132.128-148.646-132.128-181.678zM412.904 495.484c0-45.608-36.974-82.58-82.58-82.58-49.548 0-198.194 99.098-198.194 165.162s79.934 144.904 148.646 99.096c49.548-33.032 132.128-148.646 132.128-181.678z"
                fill="#6B676E"
            />
            <path
                d="M512.002 726.622c-30.06 0-115.614 5.668-115.614 33.032 0 49.638 105.484 85.24 115.614 82.58 10.128 2.66 115.614-32.944 115.614-82.58-0.002-27.366-85.556-33.032-115.614-33.032z"
                fill="#464655"
            />
            <path
                d="M330.324 495.484m-33.032 0a33.032 33.032 0 1 0 66.064 0 33.032 33.032 0 1 0-66.064 0Z"
                fill="#464655"
            />
            <path
                d="M693.678 495.484m-33.032 0a33.032 33.032 0 1 0 66.064 0 33.032 33.032 0 1 0-66.064 0Z"
                fill="#464655"
            />
        </svg>
    );

    const PandaIcon = props => <Icon component={PandaSvg} {...props} />;
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const state = useSelector(state => state.cartReducer);
    const navigate = useNavigate();

    const [data, setData] = useState([]); // Danh sách câu hỏi
    const [answer, setAnswer] = useState(null); // Câu trả lời hiện tại
    const [isExisting, setIsExisting] = useState(false); // Kiểm tra đã làm bài chưa

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Lấy danh sách câu hỏi
                const result = await getData("questions");
                const filteredQuestions = result.filter(item => item.topicId === parseInt(id));
                setData(filteredQuestions);

                // Tạo một đối tượng rỗng cho câu trả lời mới
                const newAnswer = {
                    id: Date.now(), // Đảm bảo ID duy nhất
                    userId: state.id,
                    topicId: parseInt(id),
                    answers: filteredQuestions.map(q => ({ questionId: q.id, answer: null }))
                };
                setAnswer(newAnswer);
                setIsExisting(false);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
            }
        };

        fetchData();
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, [id, state.id]);

    // Xử lý thay đổi đáp án
    const handleChange = (questionId, answerIndex) => {
        setAnswer(prevState => ({
            ...prevState,
            answers: prevState.answers.map(item =>
                item.questionId === questionId ? { ...item, answer: answerIndex } : item
            )
        }));
    };

    // Xử lý khi gửi bài kiểm tra
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!answer) return;
       

        if (isExisting) {
            await putData(`userAnswers/${answer.id}`, answer);
        } else {
            await postData("userAnswers", answer);
        }

        // Reset lại state sau khi hoàn thành
        setAnswer({
            id: Date.now(),
            userId: state.id,
            topicId: parseInt(id),
            answers: data.map(q => ({ questionId: q.id, answer: null }))
        });
     
        // Chuyển hướng đến trang lịch sử
        navigate(`/history/${id}`);
    };

    return (
        <Spin spinning={loading} indicator={<PandaIcon style={{ fontSize: '64px' }} spin />}>

        <div className="questions">
            <button onClick={() => navigate(-1)}><FcPrevious /> Quay lại</button>
            <form className="container" onSubmit={handleSubmit}>
                <h2 >Hãy chọn đáp án mà bạn thấy đúng nhất  !</h2>

                {data.map((item, index) => (
                    <div className="questions__item" key={item.id}>
                        <h3>Câu hỏi {index + 1}: {item.question} ?</h3>
                        <br />
                        {item.answers.map((answerOption, answerIndex) => (
                            <div className="questions__answer" key={answerIndex}>
                                <label>
                                    <input
                                        type="radio"
                                        name={`question_${item.id}`}
                                        value={answerIndex}
                                        checked={answer?.answers.find(a => a.questionId === item.id)?.answer === answerIndex}
                                        onChange={() => handleChange(item.id, answerIndex)}
                                    />
                                    {answerOption}
                                </label>
                                <br />
                            </div>
                        ))}
                    </div>
                ))}
                <button type="submit">Hoàn thành bài kiểm tra</button>
            </form>
            </div>
        </Spin>
    );
}

export default Questions;
