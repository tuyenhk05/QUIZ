import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getData } from '../../services/productService';
import { FcPrevious } from "react-icons/fc";
import { Spin } from 'antd';
import Icon from '@ant-design/icons';
function HistoryAnswer() {
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
    const navigate = useNavigate();
    const state = useSelector(state => state.cartReducer);
    const [data, setData] = useState({ answers: [] });
    const [dataQuestion, setDataQuestion] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userAnswers, questions] = await Promise.all([
                    getData("userAnswers"),
                    getData("questions")
                ]);

                const userAnswer = userAnswers.reverse().find(item => item.userId === state.id && item.topicId === parseInt(id));
                setData(userAnswer || { answers: [] });
                setDataQuestion(questions.filter(item => item.topicId === parseInt(id)));
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };
        setLoading(true);
        fetchData();
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, [id, state.id]);

    const isCorrectAnswer = (question, userAnswers) => {
        const userAnswer = userAnswers.find(a => a.questionId === question.id);
        return userAnswer ? userAnswer.answer === question.correctAnswer : false;
    };

    const correctAnswersCount = useMemo(() => {
        if (!data || !data.answers) return 0;
        return dataQuestion.filter(q => {
            const userAnswer = data.answers.find(a => a.questionId === q.id);
            return userAnswer?.answer === q.correctAnswer;
        }).length;
    }, [data, dataQuestion]);
    const feedbackMessage = useMemo(() => {
        const percent = (correctAnswersCount / dataQuestion.length) * 100;

        if (percent < 20) return "Bạn cần luyện tập nhiều hơn về chủ đề này!";
        if (percent < 50) return "Tôi tin bạn có thể làm tốt hơn!";
        if (percent < 70) return "Bạn đang làm rất tốt, hãy cố gắng hơn nữa!";
        if (percent < 90) return "Xuất sắc! Bạn gần như hoàn hảo rồi!";
        return "Hoàn hảo! Bạn đã đạt điểm tối đa!";
    }, [correctAnswersCount, dataQuestion.length]);

    return (
        <Spin spinning={loading} indicator={<PandaIcon style={{ fontSize: '64px' }} spin />}>

        <div className="history">
            <button onClick={() => navigate("/")}><FcPrevious /> Quay lại trang chủ</button>

            <div className="container">
                <h2>Lịch sử làm bài</h2>
                {dataQuestion.length > 0 && (
                    <>
                        <h3>Bạn đã trả lời đúng {((correctAnswersCount / dataQuestion.length) * 100).toFixed(1)}% ({correctAnswersCount} / {dataQuestion.length} câu)</h3>
                        <p className="feedback">{feedbackMessage}</p>
                    </>
                )}

                {dataQuestion.length > 0 ? (
                    <form>
                        {dataQuestion.map((item, index) => {
                            const correct = isCorrectAnswer(item, data.answers);
                            return (
                                <div className="questions__item" key={item.id}>
                                    <h3>
                                        Câu hỏi {index + 1}: {item.question} ?
                                        <span>{correct ? <span className="true">Đúng</span> : <span className="false">Sai</span>}</span>
                                    </h3>
                                    {item.answers.map((answerOption, answerIndex) => {
                                        const userAnswer = data.answers.find(a => a.questionId === item.id);
                                        const isChecked = userAnswer?.answer === answerIndex;
                                        const isTrue = item.correctAnswer === answerIndex;
                                        let css = "questions__answer";

                                        if (isChecked && userAnswer?.answer != null) css += " answerid__false";
                                        if (isTrue) css += " answerid__true";

                                        return (
                                            <div className={css} key={answerIndex}>
                                                <label>
                                                    <input type="radio" name={`question_${item.id}`} value={answerIndex} checked={isChecked} disabled />
                                                    {answerOption}
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </form>
                ) : (
                    <p>Không có dữ liệu.</p>
                )}
                <button onClick={() => navigate(`/topics/${id}`)}>Làm lại</button>
            </div>
            </div>
        </Spin>
    )
}
    export default HistoryAnswer;