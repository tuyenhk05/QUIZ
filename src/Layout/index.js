import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import './Layout.scss';
import { useSelector, useDispatch } from 'react-redux';
import { lockout } from '../action/cart';
import { FcMenu } from "react-icons/fc";
import { useState, useRef, useEffect } from 'react';

function Layout() {
    const navigate = useNavigate(); 
    const isLogin = useSelector(state => state.cartReducer);
    const dispatch = useDispatch();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const handleLockout = () => {
        dispatch(lockout());
        navigate('/login');
    };

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    // 🛠 Xử lý đóng menu khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <><div className="app">
            <div className="Layout__background">
                <div className="container">
                    <header className="Layout__header">
                        <div className="Layout__header--logo">
                            <Link to="/">Love question forever</Link>
                        </div>

                        <ul className="Layout__header--menu">
                            <li><NavLink to="/" onClick={() => setIsMenuOpen(false)}>Home</NavLink></li>
                            <li><NavLink to="topics" onClick={() => setIsMenuOpen(false)}>Chủ đề</NavLink></li>
                            <li><NavLink to="history" onClick={() => setIsMenuOpen(false)}>Lịch sử</NavLink></li>
                        </ul>

                        {isLogin.isLogin ? (
                            <div className="logout">
                                <span>{isLogin.fullName}</span>
                                <button onClick={handleLockout}> Đăng xuất</button>
                            </div>
                        ) : (
                            <div className="Layout__header--loginsignup">
                                <NavLink to="login" onClick={() => setIsMenuOpen(false)}>Đăng nhập </NavLink>
                                <span> | </span>
                                <NavLink to="register" onClick={() => setIsMenuOpen(false)}> Đăng ký</NavLink>
                            </div>
                        )}

                        {/* 🔥 Toggle menu icon */}
                        <FcMenu className={`menu ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu} />

                        {/* 🔥 Menu trượt từ phải */}
                        <div ref={menuRef} className={`menu__nav ${isMenuOpen ? 'active' : ''}`}>
                            <ul className="menu__nav-list">
                                <li><NavLink to="/" onClick={() => setIsMenuOpen(false)}>Home</NavLink></li>
                                <li><NavLink to="topics" onClick={() => setIsMenuOpen(false)}>Chủ đề</NavLink></li>
                                <li><NavLink to="history" onClick={() => setIsMenuOpen(false)}>Lịch sử</NavLink></li>

                                {isLogin.isLogin ? (
                                    <div className="menu__nav--user">
                                        <span>{isLogin.fullName}</span>
                                        <button onClick={handleLockout}> Đăng xuất</button>
                                    </div>
                                ) : (<>
                                    <li className="menu__nav--login">
                                        <NavLink to="login" onClick={() => setIsMenuOpen(false)}>Đăng nhập</NavLink>
                                        </li>
                                        <li>
                                        <NavLink to="register" onClick={() => setIsMenuOpen(false)}>Đăng ký</NavLink>
                                        </li></>
                                )}

                            </ul>

                        </div>
                    </header>
                </div>
            </div>

            <main className="content">
                <Outlet />
            </main>

            <footer>
                <p>© 2025 - Love question forever by HUYNHKIMTUYEN</p>
            </footer>
        </div>
        </>
    );
}

export default Layout;
