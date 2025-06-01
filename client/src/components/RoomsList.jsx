import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStoreRooms } from '../utils/selectors';
import { updateActiveRoom, setActiveRoomId, setRooms } from '../store/reducers/roomsReducer';

import { getAllRooms } from '../api/rooms';
import LoadingCenterSpinner from './LoadingCenterSpinner';

const RoomsList = () => {
    const dispatch = useDispatch();

    const [searchValue, setSearchValue] = useState('');
    const [isPageReady, setIsPageReady] = useState(false);

    const rooms = useSelector(getStoreRooms);

    const filteredRooms = useMemo(() => {
        if (!Array.isArray(rooms)) return [];
        if (!searchValue) return rooms;

        return rooms.filter((roomData) => {
            const { name, status, currentPhase } = roomData || {};

            return name.toLowerCase().includes(searchValue.toLowerCase()) ||
                status.toLowerCase().includes(searchValue.toLowerCase()) ||
                currentPhase.toLowerCase().includes(searchValue.toLowerCase());
        });
    }, [searchValue, rooms]);

    useEffect(() => {
        setTimeout(() => {
            getAllRooms()
                .then((results) => {
                    const { data = [] } = results || {};

                    dispatch(setRooms(data));
                    setIsPageReady(true);
                })
                .catch((error) => {
                    console.log(error);
                });
        }, 500);
    }, []);

    return (
        isPageReady ? (
            <>
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
                                    <th>Room name</th>
                                    <th>Room status</th>
                                    <th>Players</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredRooms.map((roomData) => {
                                    const {
                                        id,
                                        name,
                                        status,
                                        players = [],
                                    } = roomData || {};
                                    const playersCount = players.length;
                                    const PLAYERS_TOTAL_LIMIT = 2;
                                    const isGameStarted = status === 'in_game';
                                    const isLimit = playersCount >= PLAYERS_TOTAL_LIMIT;
                                    const isDisabled = isGameStarted || isLimit;

                                    return <tr key={id}>
                                        <td>{name}</td>
                                        <td>{(status || '').toUpperCase()}</td>
                                        <td>{players.length}/{PLAYERS_TOTAL_LIMIT}</td>
                                        <td>
                                            <div className="actions">
                                                <button
                                                    className="form-button"
                                                    onClick={() => {
                                                        if (isDisabled) return;

                                                        dispatch(updateActiveRoom({ id, data: roomData }));
                                                        dispatch(setActiveRoomId(id));
                                                    }}
                                                    style={{ width: '90px' }}
                                                    disabled={isDisabled}
                                                    title={isLimit ? 'Room is full' : isGameStarted ? 'Game started' : ''}
                                                >
                                                    {isDisabled ? '❌' : 'Connect'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>;
                                })}
                                </tbody>
                            </table>
                        </div>
                    )
                    : <span>No rooms</span>}
            </>
        ) : (
            <LoadingCenterSpinner />
        )
    );
};

export default RoomsList;