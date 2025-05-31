import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setGameData } from './store/reducers/gameDataReducer';

import { getGameData } from './api/game';
import MainPage from './components/MainPage';
import ModalRoot from './components/Modals/ModalRoot';

import './index.css';
import LoadingCenterSpinner from './components/LoadingCenterSpinner';

function App() {
    const dispatch = useDispatch();
    const [isPageReady, setIsPageReady] = useState(false);

    useEffect(() => {
        getGameData()
            .then((results) => {
                const { data = {} } = results || {};

                dispatch(setGameData(data));
                setIsPageReady(true);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        isPageReady ? (
            <>
                <MainPage />
                <ModalRoot />
            </>
        ) : (
            <LoadingCenterSpinner />
        )
    );
}

export default App;
