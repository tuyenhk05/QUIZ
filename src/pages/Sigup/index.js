import React, { useState } from 'react';
import { postData } from '../../services/productService';
import { useNavigate } from 'react-router-dom';
import './Sigup.scss';

function Sigup() {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id: '',
        username: '',
        email: '',
        password: '',
        token: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    // Xử lý đăng nhập
    const handleSubmit = (e) => {
        e.preventDefault();

        // Kiểm tra xem tất cả các trường đã được nhập chưa
        if (!formData.username || !formData.email || !formData.password) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        const newDatabase = {
            ...formData,
            id: Date.now(),
            token: Math.random().toString(36).substring(2, 11),
        };

        console.log(formData);
        postData("users", newDatabase);

        alert("Đăng kí thành công");
        navigate("/login");
    };

    return (
        <>
            <div className="singup">
                <div className="containerr">
                    <div className="heading">Đăng Ký</div>
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
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <label htmlFor="email">Email</label>
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
                            <button className="btn sigup" onClick={handleSubmit}>Đăng kí tài khoản</button>

                        </div>
                    </form>
                </div>
            </div>
            </>
    )
}
export default Sigup;