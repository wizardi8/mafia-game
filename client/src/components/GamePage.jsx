import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getIsUserConnectedToRoom, getStoreRooms } from '../utils/selectors';

import LoadingCenterSpinner from './LoadingCenterSpinner';

const GamePage = ({ activeRoomId }) => {
    const rooms = useSelector(getStoreRooms);

    const isUserConnectedToRoom = useSelector(getIsUserConnectedToRoom);

    const activeRoom = useMemo(() => {
        if (!Array.isArray(rooms)) return null;

        return rooms.find((room) => room.id === activeRoomId);
    }, [rooms, activeRoomId]);

    return (
        isUserConnectedToRoom ? (
            <>
                <div>room name: {activeRoom?.name}</div>
                <div>players: {activeRoom?.players?.length || 0}</div>
            </>
        ) : (
            <LoadingCenterSpinner />
        )
    );
};

export default GamePage;