const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 750;

const apcController = new ApcController();
const sheetMusic = new SheetMusic();

let midiButton;


function setup() {
   const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
   canvas.parent('canvas');
   frameRate(15);

    crearBotonMIDI();
    updateMidiButton();    

}

function mousePressed(){
    if(mouseButton === LEFT) {
        apcController.mouseFirstPressed(mouseX, mouseY);
    }
}

function mouseReleased() {
    if(mouseButton === LEFT) {
        apcController.mouseRealeased();
    }
}

function mouseWheel(event) {
    apcController.mouseWheel(mouseX, mouseY, event.delta);
}


function draw() {
    background(50, 50, 50);

    if(mouseIsPressed && mouseButton === LEFT) {
        apcController.mouseIsPressed(mouseX, mouseY);
    }
    apcController.updateController();



    //-------rendering score
    document.getElementById('score').innerHTML = '';

    if(isScoreShowed)
        sheetMusic.updateScore();
}


//TODO: we have to get rid of this somehow
//probably using a credit modal to force interaction with mouse
function crearBotonMIDI() {
    midiButton = createButton('Inicializar MIDI');
    midiButton.position(10, 120);
    midiButton.mousePressed(() => apcController.initMidi());
}


function updateMidiButton() {
    if (isMidiReady) {
        midiButton.hide();
    } else {
        midiButton.show();
    }
}


function keyPressed() {
    if ((key === 'f' || key === 'F') && isMidiReady) {
        //TODO: in the future get rid of midiOutput from GLOBALS and configure it on apcController
        if (midiOutput) 
            apcController.fillPads();
    }

    if ((key === 'c' || key === 'C') && isMidiReady) {
        //TODO: in the future get rid of midiOutput from GLOBALS and configure it on apcController
        if (midiOutput) 
            apcController.clearPads();
    }

    if ((key === 's' || key === 'S') && isMidiReady) {
       isScoreShowed = !isScoreShowed;
    }

}



//----------------------------




  
  


