import React from 'react';
import { useSelector } from 'react-redux';
import { getGameDate, getIsUserConnectedToRoom } from '../utils/selectors';

import LoadingCenterSpinner from './LoadingCenterSpinner';

const GamePage = ({ activeRoom }) => {
    const { currentRole } = useSelector(getGameDate);
    const isUserConnectedToRoom = useSelector(getIsUserConnectedToRoom);

    return (
        isUserConnectedToRoom ? (
            <>
                <div>room name: {activeRoom?.name}</div>
                <div>game status: {activeRoom?.status}</div>
                <div>game phase: {activeRoom?.currentPhase}</div>
                <div>players: {activeRoom?.players?.length || 0}</div>
                <div>current role: {currentRole || 'n/a'}</div>
            </>
        ) : (
            <LoadingCenterSpinner />
        )
    );
};

export default GamePage;