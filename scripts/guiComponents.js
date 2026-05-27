
class PadButton {
    constructor(x, y, width, height, value) {
        this.x = x;
        this.y = y;

        this.width = width;
        this.height = height;
        this.border = 6;

        this.padValue = value;
        this.isPressed = false;
        this.isActive = false;
    }

    drawButton() {
        stroke(255, 255, 255);
        
        if(this.isPressed || this.isActive) {
            fill('#FFFFFF');
        }
        else {
            noFill();
        }

        rect(this.x, this.y, this.width, this.height, this.border);
    }
    
    setPressed(value) {
        this.isPressed = value;
    }

    getPressed() {
        return this.isPressed;
    }

    setActive(value) {
        this.isActive = value;
    }

    getActive() {
        return this.isActive;
    }

    isPadBounds(x, y) {
        return (x >= this.x && x <= this.x + this.width) && (y >= this.y && y <= this.y + this.height); 
    }

}

//---------------------

class CircularButton {
    constructor(x, y, d, value) {
        this.x = x;
        this.y = y;
        this.d = d;
        
        this.buttonValue = value;
        this.isPressed = false;
    }

    drawButton() {
        stroke(255, 255, 255);

        if(this.isPressed) {
            fill('#FFFFFF');
        }
        else {
            noFill();
        }

        circle(this.x, this.y, this.d);    
    }  
    

    checkButtonIsPressed(x, y) {
        if(this.isRadiousBounds(x, y)) { 
            this.isPressed = true;
        }
        else {
            this.isPressed = false;
        }
    }

    checkButtonReleased() {
        if(this.isPressed) {
            this.isPressed = false;
        }
    }

    isRadiousBounds(x, y) {
        const distance = dist(x, y, this.x, this.y);
        return distance <= this.d / 2;
    }
}

//---------------------

class ShiftButton {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.width = 34;
        this.height = 32;

        this.buttonValue = 98;
        this.isPressed = false;
    }

    drawButton(apc_x, apc_y) {
        stroke(255, 255, 255);

        if(this.isPressed) {
            fill('#FFFFFF');
        }
        else {
            noFill();
        }
        
        rect(this.x, this.y, this.width, this.height);
    }

    checkShiftButtonIsPressed(x, y) { 
        if(this.isShiftBounds(x, y)) {
            this.isPressed = true;
        }
        else {
            this.isPressed = false;
        }
    }

    checkShiftButtonReleased() {
        if(this.isPressed) {
            this.isPressed = false;
        }
    }

    isShiftBounds(x, y) {
        return (x >= this.x && x <= this.x + this.width) && (y >= this.y && y <= this.y + this.height);
    }
}

//---------------------

class Slider {
    constructor(x, y, width){
        this.borderPosition_X = x; 
        this.borderPosition_Y = y;
        this.borderWidth = width;
        this.borderHeight = 161;
        this.borderRadius = 5;

        this.centerDistanceFromBorder_X = 25;
        this.centerDistanceFromBorder_Y = 22;
        this.centerPositionX = this.borderPosition_X + this.centerDistanceFromBorder_X;
        this.centerPositionY = this.borderPosition_Y + this.centerDistanceFromBorder_Y;
        this.centerWidth = 11;
        this.centerHeight = 122;
        this.centerRadius = 2;

        this.thumbPositionY_MAX = this.borderPosition_Y + 4;
        this.thumbPositionY_MIN = this.borderPosition_Y + 105;
        this.thumbPositionX = this.borderPosition_X + 3;
        this.thumbPositionY = this.thumbPositionY_MAX;
        this.thumbWidth = 55;
        this.thumbHeight = 50;
        this.thumbRadius = 5;
        
        this.decoratorPositionX = this.thumbPositionX + 4;
        this.decoratorWidth = 48;
        this.decoratorHeight = 6;
        this.decoratorRadius = 3;

        this.isPressed = false;
        this.lastMouseY = 0;
        this.mouseDistanceFromThumb = 0;
        this.wheelFactor = 5;
    }

    drawSlider() {
        stroke(255, 255, 255);
        noFill();
        
        //draw border 
        rect(this.borderPosition_X, this.borderPosition_Y, this.borderWidth, this.borderHeight, this.borderRadius);
    
        //draw center
        rect (this.centerPositionX, this.centerPositionY,this.centerWidth, this.centerHeight, this.centerRadius);
    
        //drawing thumb
        rect(this.thumbPositionX, this.thumbPositionY, this.thumbWidth, this.thumbHeight, this.thumbRadius);
    
        //draw decorator
        const decoratorPositionY = this.thumbPositionY + 23;
        rect(this.decoratorPositionX, decoratorPositionY, this.decoratorWidth, this.decoratorHeight, this.decoratorRadius);
    }

    checkSliderPressed(x, y) {
        if(this.isThumbBounds(x, y)) {
            this.isPressed = true;
            this.mouseDistanceFromThumb = y - this.thumbPositionY;
        }
    }

    checkSliderReleased() {
        if(this.isPressed){
            this.isPressed = false;
        }
    }

    checkSliderWheel(x, y, delta) {
        if(this.isSliderBounds(x, y)) {
            let amount;

            if (delta > 0) {
                amount = 1;
            } 
            else {
                amount = -1;
            }
            amount *= this.wheelFactor;
            this.thumbPositionY = this.limitThumbY(amount + this.thumbPositionY );
        }
    }

    updateSlider(y) {
        if(this.lastMouseY != y) {
            const targetThumbY = y - this.mouseDistanceFromThumb;

            this.thumbPositionY = this.limitThumbY(targetThumbY);
            this.lastMouseY = y;
        }
    }

    isSliderBounds(x, y) {
        return (x >= this.borderPosition_X && x <= this.borderPosition_X + this.borderWidth) && (y >= this.borderPosition_Y && y <= this.borderPosition_Y + this.borderHeight);
    }

    isThumbBounds(x, y) {
        return (x >= this.thumbPositionX && x <= this.thumbPositionX + this.thumbWidth) && (y >= this.thumbPositionY && y <= this.thumbPositionY + this.thumbHeight);
    }

    limitThumbY(targetThumbY){
        if(targetThumbY < this.thumbPositionY_MAX) {
            targetThumbY = this.thumbPositionY_MAX;
        }

        if(targetThumbY > this.thumbPositionY_MIN) {
            targetThumbY = this.thumbPositionY_MIN;
        }

        return targetThumbY;
    }
}
