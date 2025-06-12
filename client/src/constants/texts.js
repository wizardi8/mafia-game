import { PLAYERS_MIN_LIMIT, WINNER_NAMES, WINNERS } from '../../../shared/constants/players';

export const ALERT_MESSAGES = {
    SOMETHING_WENT_WRONG: 'Something went wrong',
    GAME_ALREADY_STARTED: 'Вибачте, гра вже почалась',
    GAME_STARTED: 'Гра вже почалась',
    PLAYERS_MIN_LIMIT: `Щоб почати гру повинно бути мінімум ${PLAYERS_MIN_LIMIT} гравці`,
    START_GAME: 'Почніть, будь ласка, гру ▶️',
    NO_CITIZEN_FOR_MAFIA: 'Немає активних мирних жителів. Ви виграли! 🎉',
    NO_CITIZEN_FOR_CITIZEN: 'Немає активних мирних жителів. Мафія виграла! 😎',
    NO_AVAILABLE_PLACES: 'Немає вільних місць',
    NO_ROOMS: 'Немає кімнат',
    NO_PASSWORD: 'No password',
    INCORRECT_PASSWORD: 'Password is incorrect',
    YOU_HAVE_BEEN_KILLED: 'Вас було вбито ☠️',
    NIGHT_MOVE: 'Зараз ходить мафія',
    NIGHT_MOVE_HINT: 'Виберіть, будь ласка, вашу жертву',
    DAY_MOVE_HINT: 'Виберіть, будь ласка, хто мафія',
    CHOOSE_PLAYER: 'Для підтвердження виберіть гравця',
    ENTER_PLAYER_NAME: 'Введіть, будь ласка, ваше ім\'я',
    CANNOT_OPEN_SETTINGS: 'Щоб відкрити налаштування, спочатку залиште кімнату ↩️',
    PLAYER_ALREADY_CONFIRMED: 'Гравець вже підтверджений',
};

export const getWinnerText = (winner) => {
    return `${WINNER_NAMES[winner]} ${winner === WINNERS.CITIZENS ? '👱🏼‍♂️' : '🧛🏾'}`;
};

export const BUTTON_MESSAGES = {
    LEAVE_GAME: 'Залишити гру ↩️',
    LEAVE_ROOM: 'Залишити кімнату ↩️',
    START_GAME: 'Почати гру ▶️',
    HISTORY_GAME: 'Історія гри 🕒',
    CONFIRM: 'Підтвердити',
    CONFIRMED: 'Підтверджено ✔️',
    CLEAR: 'Очистити',
    CONNECT_TO_ROOM: 'Підключитись 🌐',
    CANNOT_CONNECT: '❌',
    CLOSE: 'Закрити',
    SAVE: 'Зберегти',
    SETTINGS: '⚙️',
    NEXT: 'Next',
};

export const ROOMS_TABLE = {
    NAME: 'Назва кімнати',
    STATUS: 'Статус гри',
    PLAYERS_COUNT: 'Кількість гравців',
};