class MicrotonalAPC {    
    constructor() {
        this.isSustained = false;
        this.isRecordChord = false;

        this.storeChords = Array.from({ length: 8 }, () => new Set());

        this.listeners = {};
    }
  
    //TODO: probably this method will not be here but in a external function as a pop-up or something
    initMIDI() {
        navigator.requestMIDIAccess()
        .then(access => {
            midiOutput = null;
          
            access.outputs.forEach(output => {
                if(output.name.includes('APC')) {
                    midiOutput = output;
                    console.log("SUCCESS: MIDI initialized and connected to", output.name);
                }
            });
      
            if(!midiOutput) 
                console.warn("ERROR: APC MINI not found!");
            else {
                isMidiReady = true;
                this.emit("initSoundEngine");
                this.fillAllPadsWithDefaultColor();
            }
            
            access.inputs.forEach(input => {
                if(input.name.includes('APC')) 
                    input.onmidimessage = (message) => this.handleMidiMessage(message);    
            });
        }).catch(err => { console.log("Error initializing MIDI:", err) });
    }


    //-- MIDI messages methods

    handleMidiMessage(message) {
        let [command, note, velocity] = message.data;
        let channel = command & 0x0F;
        let messageType = command & 0xF0;

        if(channel === 0) {
            if(messageType === 144 && velocity > 0) 
                this.noteOn(note, velocity); 
            else if (messageType === 128) 
                this.noteOff(note); 
            else if(messageType === 176) 
                this.controlChange(note, velocity); 
        }
    }


    getPadNote(padNumber) {
        const adjustedPad = padNumber + keyOffset;
        const noteName = pcData[mod(adjustedPad, 31)].note;
        let noteOctave = Math.floor(adjustedPad / 31) + 4;
        //Correct octave for C half-flat
        if(noteName == 'Cd') noteOctave++;

        return noteName + noteOctave;
    }

    getPadNumberFromNote(note) {
        const noteName = note.substring(0, 2);
        let noteOctave = parseInt(note.substring(2));
        //Revert octave correction for C half-flat
        if(noteName == 'Cd') noteOctave--;

        let noteIndex;
        for(let i = 0; i < 31; i++){
            if(pcData[i].note == noteName)
                noteIndex = i;
        }

        return (noteOctave - 4) * 31 + noteIndex - keyOffset;
    }


    noteOn(padNumber, velocity) {
        //Check if is a keyboard pad
        if(isPadBoard(padNumber)) {
            const currentNote = this.getPadNote(padNumber);
            let isPlayingAllowed = false;

            if(!sustainedChord.has(currentNote) && !currentChord.has(currentNote)) {
                if(this.isSustained) {                    
                    addToSustained(currentNote);
                    this.keyboardPadBlinkingColorOn(padNumber);
                    isPlayingAllowed = true;
                }
                else if(!notesPressed.has(currentNote)) {
                    addToNotesPressed(currentNote);
                    this.padColorOff(padNumber);
                    this.emit("makePadActive", { padNumber: padNumber, value: true });
                    isPlayingAllowed = true;  
                }

                if(isPlayingAllowed)
                    this.playSound(padNumber);
            }
        }
        //Check if is a chord pad
        else if(isVerticalBoard(padNumber)) {
            const index = padNumber - 82;
            let ledValue = 1;

            if(!this.isRecordChord) {
                if(this.storeChords[index].size > 0) {
                    for(const note of this.storeChords[index]) {
                        if(!sustainedChord.has(note)) {
                            const currentPad = this.getPadNumberFromNote(note);

                            if(!currentChord.has(note) && !notesPressed.has(note)) 
                                this.playSound(currentPad);

                            addNoteToChord(note);

                            if(notesPressed.has(note))
                                removeFromnotesPressed(note);
                            
                            if(currentPad >= 0 && currentPad <= 63) {
                                this.padColorOff(currentPad);
                                this.keyboardPadBlinkingColorOn(currentPad);
                            }
                        }
                    }
                }
                else 
                    ledValue = 0;
            }
            else {
                if(sustainedChord.size > 0)
                    this.storeChords[index] = new Set(sustainedChord);
                else
                    this.storeChords[index].clear();

                ledValue = 2;
            }

            this.padColorOn(padNumber, ledValue);
        }
        //RECORD CHORRD
        else if(padNumber == 70) {            
            this.isRecordChord = true;
            this.padColorOn(padNumber, 1);
        }
        //SUSTAIN
        else if(isShiftButton(padNumber)) {
            const allSounds = new Set([...currentChord, ...notesPressed]);

            for(const note of allSounds) {
                addToSustained(note);

                if(currentChord.has(note))
                    removeNoteFromChord(note);
                else
                    removeFromnotesPressed(note);

                const currentPadNumber = this.getPadNumberFromNote(note);
                
                if(currentPadNumber >= 0 && currentPadNumber <= 63)
                    this.keyboardPadBlinkingColorOn(currentPadNumber);
            }

            this.isSustained = true;
        }
        //Clear SUSTAIN
        else if(padNumber == 71) {            
            for(const note of sustainedChord) {
                const currentPad = this.getPadNumberFromNote(note);

                if(currentPad >= 0 && currentPad <= 63)
                    this.keyboardPadColorOn(currentPad);

                this.stopSound(note);
            }

            this.padColorOn(padNumber, 1);
            clearSustained();
        }
        //Check if is pad offset key
        else if(padNumber >= 64 && padNumber <= 68) {
            if(notesPressed.size > 0) {
                for(const note of notesPressed) {
                    this.stopSound(note);
                    removeFromnotesPressed(note);
                }
            }

            if(padNumber == 64) keyOffset -= 8;
            if(padNumber == 65) keyOffset += 8;
            if(padNumber == 66) keyOffset ++;
            if(padNumber == 67) keyOffset --;
            if(padNumber == 68) keyOffset = 0;

            this.padColorOn(padNumber, 1);
            this.fillAllPadsWithDefaultColor();

            // Repaint already on notes   
            if(sustainedChord.size > 0) {
                for(const note of sustainedChord) { 
                    const currentPad = this.getPadNumberFromNote(note);

                    if(currentPad >= 0 && currentPad <= 63)
                        this.keyboardPadBlinkingColorOn(currentPad);
                }
            }

            if(currentChord.size > 0) {   
                for(const note of currentChord) { 
                    const currentPad = this.getPadNumberFromNote(note);

                    if(currentPad >= 0 && currentPad <= 63)
                        this.keyboardPadBlinkingColorOn(currentPad);
                }
            }
        }
        else {
            console.log(`NOTE_ON-> Pad Number:${padNumber} | Velocity:${velocity}`);
        }
    }

    
    noteOff(padNumber){
        //Check if is a keyboard pad
        if(isPadBoard(padNumber)) {
            const currentNote = this.getPadNote(padNumber);

            if(!sustainedChord.has(currentNote) && !currentChord.has(currentNote) && notesPressed.has(currentNote)) {
                this.keyboardPadColorOn(padNumber);
                this.stopSound(currentNote);
                removeFromnotesPressed(currentNote);
                this.emit("makePadActive", { padNumber: padNumber, value: false });
            }
        }
        //Check if is a chord pad
        else if(isVerticalBoard(padNumber)) {
            if(!this.isRecordChord) {
                const index = padNumber - 82;

                if(this.storeChords[index].size > 0) {
                    for(const note of this.storeChords[index]) {
                        if(!sustainedChord.has(note) && currentChord.has(note)) {
                            const currentPad = this.getPadNumberFromNote(note);

                            if(currentPad >= 0 && currentPad <= 63)
                                this.keyboardPadColorOn(currentPad);

                            this.stopSound(note);
                            removeNoteFromChord(note);
                        }
                    }
                }
            }

            this.padColorOff(padNumber);
        }
        //RECORD CHORRD
        else if(padNumber == 70) {
            this.isRecordChord = false;
            this.padColorOff(padNumber);
        }
        else if(isShiftButton(padNumber)) //SUSTAIN
            this.isSustained = false;
        else if(padNumber == 71) //Clear SUSTAIN
            this.padColorOff(padNumber);        
        else if(padNumber >= 64 && padNumber <= 68) //Check if is pad offset key
            this.padColorOff(padNumber);
        else 
            console.log(`NOTE_OFF-> Pad Number:${padNumber}`);
    }


    controlChange(ccNumber, value) {
        // Check if is master volume
        if(ccNumber == 56) {
            this.emit("setMasterVolume", { ccValue: value });
        }
        else 
            console.log(`CONTROL_CHANGE-> CC:${ccNumber} | Value:${value}`);
            

        this.emit("setGuiSliderPosition", {ccNumber: ccNumber, value: value});
    }


    //--- Sound handlers

    playSound(padNumber) {         
        const currentNote = this.getPadNote(padNumber);
        const adjustedPad = padNumber + keyOffset;

        this.emit("playNote", { midiNumber: adjustedPad, noteName: currentNote });
    }


    stopSound(note) {
        this.emit("releaseNote", { noteName: note });
    }


    //-- Color methods

    fillAllPadsWithDefaultColor() {
        for(let i = PAD_BOARD_MIN_VALUE; i <= PAD_BOARD_MAX_VALUE; i++) 
            this.keyboardPadColorOn(i);

        for(let i = HORIZONTAL_BOARD_MIN_VALUE; i <= HORIZONTAL_BOARD_MAX_VALUE; i++) 
            this.padColorOff(i);
        
        for(let i = VERTICAL_BOARD_MIN_VALUE; i <= VERTICAL_BOARD_MAX_VALUE; i++) 
            this.padColorOff(i);
    }
  
    clearAllColors() {
        for(let i = PAD_BOARD_MIN_VALUE; i <= PAD_BOARD_MAX_VALUE; i++)
            this.padColorOff(i);
    }
  
    padColorOn(padNumber, value) {
        midiOutput.send([144, padNumber, value]);
    }

    padColorOff(padNumber) {
        midiOutput.send([144, padNumber, 0]); 
    }

    keyboardPadColorOn(padNumber) {
        const adjustedPad = padNumber + keyOffset;
        const pcDataIndex = mod(adjustedPad, pcData.length);
        const colorValue = pcData[pcDataIndex].color.toUpperCase();

        this.padColorOn(padNumber, colorMapping[colorValue]);
    }

    keyboardPadBlinkingColorOn(padNumber) {
        const adjustedPad = padNumber + keyOffset;
        const pcDataIndex = mod(adjustedPad, pcData.length);
        const colorValue = pcData[pcDataIndex].color.toUpperCase();

        this.padColorOn(padNumber, colorMapping[colorValue] + 1);
    }


    //-- Event handlers

    on(event, callback) {
        this.listeners[event] = callback;
    }


    emit(event, data) {
        if(this.listeners[event]) {
            this.listeners[event](data);
        }
    }


}