const ROOM_STATUSES = {
    WAITING: 'waiting',
    IN_GAME: 'in_game',
};

const ROOM_STATUS_NAMES = {
    [ROOM_STATUSES.WAITING]: 'Очікування',
    [ROOM_STATUSES.IN_GAME]: 'Гра триває',
};

const ROOM_PHASES = {
    NIGHT: 'night',
    DAY: 'day',
    VOTING: 'voting',
};

const ROOM_PHASE_NAMES = {
    [ROOM_PHASES.NIGHT]: 'Ніч',
    [ROOM_PHASES.DAY]: 'День',
    [ROOM_PHASES.VOTING]: 'Голосування',
};

const DEFAULT_ROOM = {
    status: ROOM_STATUSES.WAITING,
    currentPhase: ROOM_PHASES.NIGHT,
    roles: [],
    votes: {},
    history: [],
};

module.exports = { ROOM_STATUSES, ROOM_STATUS_NAMES, ROOM_PHASES, ROOM_PHASE_NAMES, DEFAULT_ROOM };