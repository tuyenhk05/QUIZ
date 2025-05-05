import { useSelector } from 'react-redux';
import './Home.scss';
import { useNavigate } from 'react-router-dom';
function Home() {
    const state = useSelector(state => state.cartReducer)
    const navigate = useNavigate();
    return (
        <>
            <div className="home_container">
                {state.isLogin ?

                    <div className="main__content ">
                        <div className="main__title">
                            <h1>
                                Chào mừng {state.fullName}
                            </h1>
                        </div>
                        <p>"Tình yêu là một hành trình đầy câu hỏi - và chúng tôi ở đây để giúp bạn tìm ra câu trả lời."<br />
                            Dù bạn đang đắm chìm trong những khoảnh khắc ngọt ngào hay đứng trước những băn khoăn trong trái tim
                            , LOVE QUESTION FOREVER sẽ là nơi bạn tìm thấy sự thấu hiểu và những lời khuyên chân thành nhất.
                            Hãy để chúng tôi đồng hành cùng bạn trên hành trình khám phá tình yêu đầy màu sắc này! ❤️
                        </p>
                        <button className="cta" onClick={() => (navigate("topics"))}>
                            <span>Bắt đầu ngay</span>
                            <svg width="15px" height="10px" viewBox="0 0 13 10">
                                <path d="M1,5 L11,5"></path>
                                <polyline points="8 1 12 5 8 9"></polyline>
                            </svg>
                        </button>
                    </div>
                    :
                    <div className="main__content ">
                        <div className="main__title">
                            <h2>Chào mừng bạn đến với</h2> <h1> LOVE QUESTION FOREVER
                            </h1>
                        </div>
                        <p>"Tình yêu là một hành trình đầy câu hỏi - và chúng tôi ở đây để giúp bạn tìm ra câu trả lời."<br />
                            Dù bạn đang đắm chìm trong những khoảnh khắc ngọt ngào hay đứng trước những băn khoăn trong trái tim
                            , LOVE QUESTION FOREVER sẽ là nơi bạn tìm thấy sự thấu hiểu và những lời khuyên chân thành nhất.
                            Hãy để chúng tôi đồng hành cùng bạn trên hành trình khám phá tình yêu đầy màu sắc này! ❤️
                        </p>
                        <span>Trước tiên thì bạn hãy đăng nhập nhé !</span>
                        <br />
                        <button className="cta" onClick={() => (navigate("/login"))}>
                            <span>Đăng nhập</span>
                            <svg width="15px" height="10px" viewBox="0 0 13 10">
                                <path d="M1,5 L11,5"></path>
                                <polyline points="8 1 12 5 8 9"></polyline>
                            </svg>
                        </button>
                    </div>
                }
            </div>

        </>
    )
}
export default Home;