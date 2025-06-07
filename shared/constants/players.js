const ROLES = {
    MAFIA: 'mafia',
    CITIZEN: 'citizen',
};

const ROLE_NAMES = {
    [ROLES.MAFIA]: 'Мафія',
    [ROLES.CITIZEN]: 'Мирний гравець',
};

const WINNERS = {
    MAFIA: 'mafia',
    CITIZENS: 'citizens',
};

const WINNER_NAMES = {
    [WINNERS.MAFIA]: 'Команда мафії',
    [WINNERS.CITIZENS]: 'Команда мирних гравців',
};

const PLAYERS_TOTAL_LIMIT = 8;
const PLAYERS_MIN_LIMIT = 3;

module.exports = { ROLES, PLAYERS_TOTAL_LIMIT, ROLE_NAMES, WINNERS, WINNER_NAMES, PLAYERS_MIN_LIMIT };