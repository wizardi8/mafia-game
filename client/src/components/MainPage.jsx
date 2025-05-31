import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import LoadingCenterSpinner from './LoadingCenterSpinner';

const MainPage = () => {
    const dispatch = useDispatch();

    const [searchValue, setSearchValue] = useState('');
    const [isPageReady, setIsPageReady] = useState(false);

    const filteredRooms = [];

    useEffect(() => {
        //get rooms
    }, []);

    return (
        <div className="page">
            <div className="header">
                <div>Mafia UA</div>
                <div className="add-button-container">
                    <button className="form-button" onClick={() => {
                        // dispatch(setModal({ modalType:  }));
                        console.log('create new room');
                    }}>
                        Create new room
                    </button>
                </div>
            </div>
            <div className="main-section">
                {isPageReady
                    ? <>
                        <div className="search-section">
                            <input type="text" value={searchValue} onChange={(e) => {
                                setSearchValue(e.target.value);
                            }} />
                            <button className="form-button" onClick={() => {
                                setSearchValue('');
                            }}>
                                Clear
                            </button>
                        </div>
                        {filteredRooms.length
                            ? (
                                <div className="rooms-list">
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>Назва</th>
                                            <th>Автор</th>
                                            <th>Жанр</th>
                                            <th>Статус</th>
                                            <th>Оцінка</th>
                                            <th>Ціна</th>
                                            <th>Джерело</th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {filteredRooms.map((roomData) => {
                                            const {
                                                id,
                                                name,
                                                author,
                                                genre,
                                                status,
                                                rate,
                                                price,
                                                source,
                                            } = roomData || {};

                                            return <tr key={id}>
                                                <td>{name}</td>
                                                <td>{author}</td>
                                                <td>{genre}</td>
                                                <td>{(status || '').toUpperCase()}</td>
                                                <td>{(rate || '').toUpperCase()}</td>
                                                <td>{price} грн</td>
                                                <td>{(source || '').toUpperCase()}</td>
                                                <td className="actions">
                                                    <button onClick={() => {
                                                        console.log('edit');
                                                    }}>
                                                        Edit
                                                    </button>
                                                    <button onClick={() => {
                                                        console.log('delete');
                                                    }}>
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>;
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                            )
                            : <span>No rooms</span>}
                    </>
                    : <LoadingCenterSpinner />}
            </div>
            <div className="footer">Copyright © 2025 wizardi</div>
        </div>
    );
};

export default MainPage;