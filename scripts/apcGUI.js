
class ApcGui {
    constructor(x, y) {
        this.apc_x = x;
        this.apc_y = y;
        this.apc_width = 765;
        this.apc_height = 645;
        this.apc_border = 25
        
        this.padButton_width = 67;
        this.padButton_height = 31;
        this.padButton_distanceX = 14;
        this.padButton_distanceY = 13;

        this.circularButton_diameter = 29;
        this.circularButton_horizontalDistance = 52;
        this.circularButton_verticalDistance = 15;

        this.slider_borderWidth = 61;
        this.sliderBoardInnerDistance = 20;

        this.buttonBoardPadInitialPostion_X = this.apc_x + 25;
        this.buttonBoardPadInitialPostion_Y = this.apc_y + 66;
        this.horizontalButtonBoardInitialPostion_X = this.apc_x + 58;
        this.horizontalButtonBoardInitialPostion_Y = this.apc_y + 435;
        this.verticalButtonBoardInitialPostion_X = this.apc_x + 707;
        this.verticalButtonBoardInitialPostion_Y = this.apc_y + 81;
        this.sliderBoardInitialPosition_X = this.apc_x + 28;
        this.sliderBoardInitialPosition_Y = this.apc_y + 470;
        
        this.padButtonBoard = this.initPadButtonBoard();
        this.horizontalButtonBoard = this.initHorizontalButtonBoard();
        this.verticalButtonBoard = this.initVerticalButtonBoard();
        this.sliderBoard = this.initSliderBoard();

        this.shiftButtonInitialPostion_X = this.apc_x + 690;
        this.shiftButtonInitialPostion_Y = this.apc_y + 419;
        this.shiftButton = new ShiftButton(this.shiftButtonInitialPostion_X, this.shiftButtonInitialPostion_Y);
        
        this.listeners = {};
    }


    isApcBounds(x,y) {
        return (x >= this.apc_x && x <= this.apc_x + this.apc_width) && (y >= this.apc_y && y <= this.apc_y + this.apc_height);
    }


    drawController() {
        //Drawing apc boundaries
        stroke(255, 255, 255);
        noFill();
        rect(this.apc_x, this.apc_y, this.apc_width, this.apc_height, this.apc_border);
    
        //drawing components
        this.drawPadButtonBoard();
        this.drawHorizontalButtonBoard();
        this.drawVerticalButtonBoard();
        this.drawSliderBoard();
        this.shiftButton.drawButton();
    }
    

    mouseIsPressed(x, y) {
        const isSliderPressed = this.isSliderBoardPressed();

        if(this.isApcBounds(x, y) && !isSliderPressed) {
            this.checkPadBoardIsPressed(x, y);
            this.checkHorizontalButtonBoardIsPressed(x, y);
            this.checkVerticalButtonBoardIsPressed(x, y);
            this.shiftButton.checkShiftButtonIsPressed(x, y);
        }

        if(isSliderPressed) {
            this.updateSliderBoard(y);
        }
    }


    mouseFirstPressed(x, y) {
        if(this.isApcBounds(x, y)) {
            this.checkSliderBoardPressed(x, y);
        }
    }


    mouseRealeased() {
        this.checkPadBoardReleased();
        this.checkHorizontalButtonBoardReleased();
        this.checkVerticalButtonBoardReleased();
        this.shiftButton.checkShiftButtonReleased();
        this.checkSliderBoardReleased();        
    }


    mouseWheel(x, y, delta) {
        if(this.isApcBounds(x,y)) {
            this.checkSliderBoardWheel(x, y, delta);
        }
    }



    //--- Padboard methods

    initPadButtonBoard(){
        const padButtonBoard = new Array(64);
        
        let item = 0;
        let padValue = 55;
        for(let row = 0; row < 8; row++){
            for(let col = 0; col < 8; col++){
                const currentPadX = this.buttonBoardPadInitialPostion_X + col * (this.padButton_width + this.padButton_distanceX);
                const currentPadY = this.buttonBoardPadInitialPostion_Y + row * (this.padButton_height + this.padButton_distanceY);

                padValue++;
                padButtonBoard[item] = new PadButton(currentPadX, currentPadY, this.padButton_width, this.padButton_height, padValue);
                item++;
            }
            padValue -= 16;
        }
        return padButtonBoard;
    }


    drawPadButtonBoard(){
        for(let i = 0; i < this.padButtonBoard.length; i++)
            this.padButtonBoard[i].drawButton();
    }


    checkPadBoardIsPressed(x, y) {
        for(let i = 0; i < this.padButtonBoard.length; i++) {
            if(this.padButtonBoard[i].isPadBounds(x, y)) {
                if(!this.padButtonBoard[i].getPressed()) {
                    this.padButtonBoard[i].setPressed(true);

                    if(!this.padButtonBoard[i].getActive())
                        this.emit("noteOn", { padValue: this.padButtonBoard[i].padValue });
                }
            } 
            else {
                if(this.padButtonBoard[i].getPressed()) {
                    this.padButtonBoard[i].setPressed(false);
                    this.emit("noteOff", { padValue: this.padButtonBoard[i].padValue });
                }
            }
        }
    }


    checkPadBoardReleased() {
        for(let i = 0; i < this.padButtonBoard.length; i++) {
            if(this.padButtonBoard[i].getPressed()) {
                this.padButtonBoard[i].setPressed(false);
                this.emit("noteOff", { padValue: this.padButtonBoard[i].padValue });
            }
        }
    }


    makePadActive(padValue, value) {
        for(let i = 0; i < this.padButtonBoard.length; i++) {
            if(this.padButtonBoard[i].padValue == padValue)
                this.padButtonBoard[i].setActive(value);
        }
    }


    //--- Horizontal board methods

    initHorizontalButtonBoard() {
        const horizontalButtonBoard = new Array(8);
        let buttonValue = 64;
        
        for(let i = 0; i < horizontalButtonBoard.length; i++){
            const currentX = this.horizontalButtonBoardInitialPostion_X + i * (this.circularButton_diameter + this.circularButton_horizontalDistance);
            const currentY = this.horizontalButtonBoardInitialPostion_Y;

            horizontalButtonBoard[i] = new CircularButton(currentX, currentY, this.circularButton_diameter, buttonValue);
            buttonValue++;
        }
        return horizontalButtonBoard;
    }


    drawHorizontalButtonBoard(){
        for(let i = 0; i < this.horizontalButtonBoard.length; i++)
            this.horizontalButtonBoard[i].drawButton();
    }


    checkHorizontalButtonBoardIsPressed(x, y) {
        for(let i = 0; i < this.horizontalButtonBoard.length; i++) {
            this.horizontalButtonBoard[i].checkButtonIsPressed(x, y);
        }
    }


    checkHorizontalButtonBoardReleased() {
        for(let i = 0; i < this.horizontalButtonBoard.length; i++) {
            this.horizontalButtonBoard[i].checkButtonReleased();
        }
    }


    //--- Vertical board methods

    initVerticalButtonBoard(){
        const verticalButtonBoard = new Array(8);
        let buttonValue = 82;

        for(let i = 0; i < verticalButtonBoard.length; i++){
            const currentX = this.verticalButtonBoardInitialPostion_X;
            const currentY = this.verticalButtonBoardInitialPostion_Y + i * (this.circularButton_diameter + this.circularButton_verticalDistance);
    
            verticalButtonBoard[i] = new CircularButton(currentX, currentY, this.circularButton_diameter, buttonValue);
            buttonValue++;
        }
        return verticalButtonBoard;
    }


    drawVerticalButtonBoard(){
        for(let i = 0; i < this.verticalButtonBoard.length; i++)
            this.verticalButtonBoard[i].drawButton();
    }


    checkVerticalButtonBoardIsPressed(x, y) {
        for(let i = 0; i < this.verticalButtonBoard.length; i++) {
            this.verticalButtonBoard[i].checkButtonIsPressed(x, y);
        }
    }


    checkVerticalButtonBoardReleased() {
        for(let i = 0; i < this.verticalButtonBoard.length; i++) {
            this.verticalButtonBoard[i].checkButtonReleased();
        }
    }


    //--- Slider methods

    initSliderBoard(){
        const sliderBoard = new Array(9);

        for(let i = 0; i < sliderBoard.length; i++) {
            const currentBorderPosition_X = this.sliderBoardInitialPosition_X + i * (this.slider_borderWidth + this.sliderBoardInnerDistance);
            sliderBoard[i] = new Slider(currentBorderPosition_X, this.sliderBoardInitialPosition_Y, this.slider_borderWidth);
        }
        return sliderBoard
    }


    drawSliderBoard(){
        for(let i = 0; i < this.sliderBoard.length; i++)
            this.sliderBoard[i].drawSlider();
    }

    checkSliderBoardPressed(x, y) {
        for(let i = 0; i < this.sliderBoard.length; i++) {
            this.sliderBoard[i].checkSliderPressed(x, y);
        }
    }


    checkSliderBoardReleased() {
        for(let i = 0; i < this.sliderBoard.length; i++) {
            this.sliderBoard[i].checkSliderReleased();
        }
    }


    checkSliderBoardWheel(x, y, delta) {
        for(let i = 0; i < this.sliderBoard.length; i++){
            this.sliderBoard[i].checkSliderWheel(x, y, delta);
        }
    }


    isSliderBoardPressed() { 
        for(let i = 0; i < this.sliderBoard.length; i++) {
            if(this.sliderBoard[i].isPressed) {
                return true;
            }
        }
        return false;
    }


    updateSliderBoard(y) {
        for(let i = 0; i < this.sliderBoard.length; i++) {
            if(this.sliderBoard[i].isPressed) {
                this.sliderBoard[i].updateSlider(y);
                return;
            }
        }
    }

    setSliderPosition(ccNumber, value) {
        const sliderIndex = ccNumber - SLIDER_ONE_CC_NUMBER;
        const position = value / 127;
        
        this.sliderBoard[sliderIndex].setThumbPosition(position);
    }


    //--- Events handlers

    on(event, callback) {
        this.listeners[event] = callback;
    }


    emit(event, data) {
        if(this.listeners[event]) {
            this.listeners[event](data);
        }

    }

}