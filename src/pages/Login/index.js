/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react';
//import { get } from '../../untils/request';
import './Login.scss';
import { getData } from '../../services/productService';
import { useNavigate } from 'react-router-dom'; 
import { useDispatch } from 'react-redux';
import { updateLogin } from '../../action/cart';
import { setCookie } from '../../helpers/cookie';
import { Spin } from 'antd';
import Icon from '@ant-design/icons';
import { message } from 'antd';

function Login() {

       
    const reload = async () => {
        try {
            const data = await getData('users'); // Gọi API để lấy dữ liệu mới
            setDatabase(data); // Cập nhật lại state database
            console.log('Reloaded user data:', data); // Log để kiểm tra
        } catch (error) {
            console.error('Failed to reload user data:', error);
        }
       
    };
    useEffect(() => {
        reload(); // Gọi hàm reload khi trang được tải
    }, []);
    reload();
    const [messageApi, contextHolder] = message.useMessage();
    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'Đăng nhập thành công',
        });
    };
    const error = () => {
        messageApi.open({
            type: 'error',
            content: 'Sai tên tài khoản hoặc mật khẩu',
        });
    };
    const warning = () => {
        messageApi.open({
            type: 'warning',
            content: 'This is a warning message',
        });
    };
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
    const [loading, setLoading] = useState(false);
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
        setLoading(true);
        e.preventDefault();
        setTimeout(() => {
            const { username, password } = formData;
            console.log(database);
            // Kiểm tra dữ liệu với database.json
            const user = database.find(
                (user) =>
                    user.username === username &&
                    user.password === password
            );

            if (user) {
                success();
                // Lưu token giả lập (ví dụ dùng localStorage)
                setCookie('token', user.token, 1);
                setCookie('id', user.id, 1);
                setCookie('fullname', user.username, 1);
                setCookie('email', user.email, 1);
                
                   
                
                dispatch(updateLogin(true, user.id, user.username));
                setTimeout(() => {
                    navigate('/');
                }, 800); // Chuyển hướng sau 1 giây
            } else {
                setTimeout(() => {
                    error();
                }, 200); // Hiển thị thông báo lỗi sau 1 giây
            }

            setLoading(false);
        }, 2000);
 
    };

    return (
        <>
            {contextHolder}
            <Spin spinning={loading} indicator={<PandaIcon style={{ fontSize: '64px' }} spin />}>
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
            </Spin>
            </>
    );
}

export default Login;
