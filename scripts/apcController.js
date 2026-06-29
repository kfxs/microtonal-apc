class ApcController {
    constructor() {
        this.gui = new ApcGui(210, 50);
        this.virtualApc = new MicrotonalAPC();

        this.soundEngine = new SoundEngine();

        this.connect();
    }


    mouseFirstPressed(x, y) {
        this.gui.mouseFirstPressed(x, y);
    }

    
    mouseIsPressed(x, y) {
        this.gui.mouseIsPressed(x, y);
    }


    mouseRealeased() {
        this.gui.mouseRealeased();
    }


    mouseWheel(x, y, delta) {
        this.gui.mouseWheel(x, y, delta);
    }


    updateController() {
        this.gui.drawController();
    }


    //----

    initMidi() {
        this.virtualApc.initMIDI();
    }


    fillPads() {
        this.virtualApc.fillAllPadsWithDefaultColor();

    }


    clearPads() {
        this.virtualApc.clearAllColors();
    }

    
    //--- Event Biding

    connect() {

        //--- SoundEngine connections
        this.virtualApc.on("initSoundEngine", () => { this.soundEngine.initAudio(); });
        this.virtualApc.on("playNote", data => {  this.soundEngine.playNote(data.midiNumber, data.noteName); });
        this.virtualApc.on("releaseNote", data => { this.soundEngine.releaseNote(data.noteName); });
        this.virtualApc.on("setMasterVolume", data => { this.soundEngine.setMasterVolume(data.ccValue); });


        //--- Gui2VirtualApc connections
        this.gui.on("noteOn", data => { this.virtualApc.noteOn(data.padValue, 127); });
        this.gui.on("noteOff", data => { this.virtualApc.noteOff(data.padValue); });


        //--- VirtualApc2Gui connections
        this.virtualApc.on("makePadActive", data => { this.gui.makePadActive(data.padNumber, data.value); });




        

        this.virtualApc.on("setGuiSliderPosition", data => {   this.gui.setSliderPosition(data.ccNumber, data.value);     });

      
    }


}