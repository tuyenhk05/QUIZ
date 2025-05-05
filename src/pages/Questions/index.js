import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getData, postData, putData } from '../../services/productService';
import { useSelector } from 'react-redux';
import "./Quetions.scss";
import { FcPrevious } from "react-icons/fc";
function Questions() {
    const { id } = useParams();
    const state = useSelector(state => state.cartReducer);
    const navigate = useNavigate();

    const [data, setData] = useState([]); // Danh sách câu hỏi
    const [answer, setAnswer] = useState(null); // Câu trả lời hiện tại
    const [isExisting, setIsExisting] = useState(false); // Kiểm tra đã làm bài chưa

    useEffect(() => {
        const fetchData = async () => {
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
    );
}

export default Questions;
