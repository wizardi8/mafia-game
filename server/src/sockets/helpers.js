const getRandomRoles = (playerIds) => {
    const roles = ['mafia'];
    while (roles.length < playerIds.length) roles.push('citizen');
    const shuffled = playerIds.sort(() => 0.5 - Math.random());
    return Object.fromEntries(shuffled.map((id, i) => [id, roles[i]]));
};

const checkGameEnd = (room) => {
    const alive = room.players.filter(p => p.alive);
    const mafiaAlive = alive.filter(p => room.roles[p.id] === 'mafia');
    const citizensAlive = alive.filter(p => room.roles[p.id] !== 'mafia');

    if (mafiaAlive.length === 0) return 'citizens';
    if (mafiaAlive.length >= citizensAlive.length) return 'mafia';
    return null;
};

module.exports = {
    checkGameEnd,
    getRandomRoles,
};