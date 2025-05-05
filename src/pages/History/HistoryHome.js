import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getData } from '../../services/productService';
import { useNavigate } from "react-router-dom";

function HistoryHome() {
    const state = useSelector(state => state.cartReducer);
    const navigate = useNavigate();
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const [userAnswers, questions] = await Promise.all([
                getData("userAnswers"),
                getData("questions")
            ]);

            const userHistory = userAnswers.filter(item => item.userId === state.id).reverse();
            const uniqueTopics = {};

            userHistory.forEach(item => {
                if (!uniqueTopics[item.topicId]) uniqueTopics[item.topicId] = item;
            });

            const historyData = Object.values(uniqueTopics).map(item => {
                const topicQuestions = questions.filter(q => q.topicId === item.topicId);
                const correctCount = item.answers.filter(a => {
                    const question = topicQuestions.find(q => q.id === a.questionId);
                    return question && a.answer === question.correctAnswer;
                }).length;
                const totalQuestions = topicQuestions.length;
                const percentage = totalQuestions ? ((correctCount / totalQuestions) * 100).toFixed(1) : 0;

                return {
                    topicId: item.topicId,
                    correctCount,
                    totalQuestions,
                    percentage
                };
            });

            setData(historyData);
        };
        fetchData();
    }, [state.id]);

    const topicNames = {
        1: "Tình yêu và cảm xúc",
        2: "Hẹn hò và giao tiếp",
        3: "Gia đình và hôn nhân",
        4: "Giải quyết mâu thuẫn",
        5: "Kỹ năng lắng nghe"
    };

    return (
        <div className="HistoryHome">
            <div className="container">
                <h2>Lịch sử làm bài của bạn</h2>
                {state.isLogin ? (
                    data.length > 0 ? (
                        data.map((item) => (
                            <div
                                className="HistoryHome__item"
                                key={item.topicId}
                                onClick={() => navigate(`/history/${item.topicId}`)}
                            >
                                {topicNames[item.topicId] || "Chủ đề khác"} &nbsp;
                                (<b>{item.percentage}%</b> {item.correctCount}/{item.totalQuestions} câu)
                            </div>
                        ))
                    ) : (
                        <p>Bạn chưa làm bài nào.</p>
                    )
                ) : (
                    <h3>Bạn chưa đăng nhập!</h3>
                )}
            </div>
        </div>
    );
}

export default HistoryHome;