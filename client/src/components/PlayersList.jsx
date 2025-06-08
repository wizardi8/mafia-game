import React from 'react';

const PlayersList = ({ players }) => {
    return <div className="players-list">{players.map((player = {}) => {
        const { id, name, alive } = player || {};

        const classes = `players-list-item ${!alive ? 'not-alive-player' : ''}`;

        return (<div className={classes} key={id}>
            <span className="text-trim">{!alive ? '☠️ ' : ''}{name}</span>
        </div>);
    })}</div>;
};

export default PlayersList;