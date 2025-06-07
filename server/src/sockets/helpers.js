const { ROLES, WINNERS } = require('../../../shared/constants/players');

const getRandomRoles = (playerIds) => {
    const roles = [ROLES.MAFIA];
    while (roles.length < playerIds.length) roles.push(ROLES.CITIZEN);
    const shuffled = playerIds.sort(() => 0.5 - Math.random());
    return Object.fromEntries(shuffled.map((id, i) => [id, roles[i]]));
};

const checkGameEnd = (room, players) => {
    const alive = players.filter(p => p.alive);
    const mafiaAlive = alive.filter(p => room.roles[p.id] === ROLES.MAFIA);
    const citizensAlive = alive.filter(p => room.roles[p.id] !== ROLES.CITIZEN);

    if (mafiaAlive.length === 0) return WINNERS.CITIZENS;
    if (mafiaAlive.length >= citizensAlive.length) return WINNERS.MAFIA;
    return null;
};

module.exports = {
    checkGameEnd,
    getRandomRoles,
};