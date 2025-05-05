import React, { useState, useEffect } from 'react';
//import { get } from '../../untils/request';
import './Login.scss';
import { getData } from '../../services/productService';
import { useNavigate } from 'react-router-dom'; 
import { useDispatch } from 'react-redux';
import { updateLogin } from '../../action/cart';
import { setCookie } from '../../helpers/cookie';

function Login() {
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [database, setDatabase] = useState([]);

    // Đọc dữ liệu từ database.json
    useEffect(() => {
        const fetchData = async () => {
            const data = await getData('users');
            
            setDatabase(data);
            
        }
        fetchData();
        
       
    }, []);

    // Xử lý khi thay đổi dữ liệu trong form
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    // Xử lý đăng nhập
    const handleSubmit = (e) => {
       
        e.preventDefault();
        const { username, password } = formData;
        console.log(database);
        // Kiểm tra dữ liệu với database.json
        const user = database.find(
            (user) =>
                user.username === username &&
                user.password === password
        );
       
        if (user) {
           
            // Lưu token giả lập (ví dụ dùng localStorage)
            setCookie('token', user.token, 1);
            setCookie('id', user.id, 1);
            setCookie('fullname', user.username, 1);
            setCookie('email', user.email, 1);
            dispatch(updateLogin(true, user.id, user.username));
            navigate('/');
        } else {
            alert('Sai thông tin đăng nhập. Vui lòng thử lại!');
        }
    };

    return (
        <div className="login">
        <div className="containerr">
            <div className="heading">Đăng nhập</div>
            <form className="form" onSubmit={handleSubmit}>
                <div className="input-field">
                    <input
                        required
                        autoComplete="off"
                        type="text"
                        id="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <label htmlFor="username">Tên tài khoản</label>
                </div>


                <div className="input-field">
                    <input
                        required
                        autoComplete="off"
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <label htmlFor="password">Password</label>
                </div>

                <div className="btn-container">
                    <button className="btn">Đăng nhập</button>
                    <div className="acc-text">
                        Bạn quên mật khẩu?{' '}
                        <span style={{ color: '#0000ff', cursor: 'pointer' }}>
                            Lấy lại mật khẩu
                        </span>
                    </div>
                </div>
            </form>
            </div>
        </div>
    );
}

export default Login;
