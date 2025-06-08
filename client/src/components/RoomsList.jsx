import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStoreRooms } from '../utils/selectors';
import { updateActiveRoom, setActiveRoomId, setRooms } from '../store/reducers/roomsReducer';

import { getAllRooms } from '../api/rooms';

import LoadingCenterSpinner from './LoadingCenterSpinner';

import { PLAYERS_TOTAL_LIMIT } from '../../../shared/constants/players';
import { ALERT_MESSAGES, BUTTON_MESSAGES, ROOMS_TABLE } from '../constants';
import { ROOM_STATUS_NAMES, ROOM_STATUSES } from '../../../shared/constants/rooms';

const RoomsList = () => {
    const dispatch = useDispatch();

    const [searchValue, setSearchValue] = useState('');
    const [isPageReady, setIsPageReady] = useState(false);

    const rooms = useSelector(getStoreRooms);

    const filteredRooms = useMemo(() => {
        if (!Array.isArray(rooms)) return [];
        if (!searchValue) return rooms;

        return rooms.filter((roomData) => {
            const { name, status } = roomData || {};

            const isIncludeValue = (value = '') => {
                return value.toLowerCase().includes(searchValue.toLowerCase());
            };

            return isIncludeValue(name) || isIncludeValue(status);
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
                    <input type="text" name="search" value={searchValue} onChange={(e) => {
                        setSearchValue(e.target.value);
                    }} />
                    <button className="form-button" onClick={() => {
                        setSearchValue('');
                    }}>
                        {BUTTON_MESSAGES.CLEAR}
                    </button>
                </div>
                {filteredRooms.length
                    ? (
                        <div className="rooms-list">
                            <table>
                                <thead>
                                <tr>
                                    <th>{ROOMS_TABLE.NAME}</th>
                                    <th>{ROOMS_TABLE.STATUS}</th>
                                    <th>{ROOMS_TABLE.PLAYERS_COUNT}</th>
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
                                    const isGameStarted = status === ROOM_STATUSES.IN_GAME;
                                    const isLimit = playersCount >= PLAYERS_TOTAL_LIMIT;
                                    const isDisabled = isGameStarted || isLimit;

                                    return <tr key={id}>
                                        <td>{name}</td>
                                        <td>{ROOM_STATUS_NAMES[status]}</td>
                                        <td>{players.length}/{PLAYERS_TOTAL_LIMIT}</td>
                                        <td>
                                            <div className="actions">
                                                <button
                                                    className="form-button"
                                                    onClick={() => {
                                                        if (isDisabled) {
                                                            if (isGameStarted) alert(ALERT_MESSAGES.GAME_ALREADY_STARTED);
                                                            if (isLimit) alert(ALERT_MESSAGES.NO_AVAILABLE_PLACES);

                                                            return;
                                                        }

                                                        dispatch(updateActiveRoom({ id, data: roomData }));
                                                        dispatch(setActiveRoomId(id));
                                                    }}
                                                    title={isLimit
                                                        ? ALERT_MESSAGES.NO_AVAILABLE_PLACES
                                                        : isGameStarted ? ALERT_MESSAGES.GAME_STARTED : ''}
                                                >
                                                    {isDisabled
                                                        ? BUTTON_MESSAGES.CANNOT_CONNECT
                                                        : BUTTON_MESSAGES.CONNECT_TO_ROOM}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>;
                                })}
                                </tbody>
                            </table>
                        </div>
                    )
                    : <span>{ALERT_MESSAGES.NO_ROOMS}</span>}
            </>
        ) : (
            <LoadingCenterSpinner />
        )
    );
};

export default RoomsList;