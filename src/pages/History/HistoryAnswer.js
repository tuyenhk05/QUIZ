import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getData } from '../../services/productService';
import { FcPrevious } from "react-icons/fc";

function HistoryAnswer() {
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

        fetchData();
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
        <div className="history">
            <button onClick={() => navigate(-1)}><FcPrevious /> Quay lại</button>

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
    )
}
    export default HistoryAnswer;