import React, { useState, useEffect } from 'react';
import { getData } from '../../services/productService';
import './Topics.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
function Topics() {
    const [data, setData] = useState([]);
    const state = useSelector(state => state.cartReducer);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            const database = await getData('topics');
            setData(database);
        }
        fetchData();
        console.log(data);




    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (<>
        <div className="topics__backgroud ">
            {
                state.isLogin ? (
                    <div className="topics">
                        <h1>Các chủ đề </h1>

                        <ul className="topics__list" >
                            {data.map((item, index) => (
                                <li key={index} onClick={() => (navigate(`${item.id}`))}>

                                    <div className="topics__item">
                                        <h3>{item.name}</h3>

                                    </div>


                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                        <h3 className="topics">Bạn chưa đăng nhập !</h3>
                )
            }
        </div>
    </>)
}
export default Topics;