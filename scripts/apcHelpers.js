const PAD_BOARD_MIN_VALUE = 0;
const PAD_BOARD_MAX_VALUE = 63;

const HORIZONTAL_BOARD_MIN_VALUE = 64;
const HORIZONTAL_BOARD_MAX_VALUE = 71;

const VERTICAL_BOARD_MIN_VALUE = 82;
const VERTICAL_BOARD_MAX_VALUE = 89;

const SHIFT_BUTTON_VALUE = 98;



function isPadBoard(number) {
    if(number >= PAD_BOARD_MIN_VALUE && number <= PAD_BOARD_MAX_VALUE) {
        return true;
    }
    
    return false;
}


function isHorizontalBoard(number) {
    if(number >= HORIZONTAL_BOARD_MIN_VALUE && number <= HORIZONTAL_BOARD_MAX_VALUE) {
        return true;
    }

    return false;
}


function isVerticalBoard(number) {
    if(number >= VERTICAL_BOARD_MIN_VALUE && number <= VERTICAL_BOARD_MAX_VALUE) {
        return true;
    }

    return false;
}


function isShiftButton(number) {
    if(number == 98) {
        return true;
    }

    return false;
}
