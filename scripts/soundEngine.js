class SoundEngine {
    constructor () {
        this.masterVolume = 1;
        
        this.oscillators = new Array(TOTAL_NUMBER_OF_VOICES);
        this.envelopes = new Array(TOTAL_NUMBER_OF_VOICES);

        this.activeVoices = [];
        this.noteToVoiceMap = {};
    }


    initAudio() {  
        for(let i = 0; i < TOTAL_NUMBER_OF_VOICES; i++){
            this.oscillators[i] = new p5.Oscillator();
            this.oscillators[i].setType('sawtooth'); 
            this.oscillators[i].amp(0);
            this.oscillators[i].start(); 
        
            this.envelopes[i] = new p5.Envelope();
            this.envelopes[i].setADSR(0.001, 1.5, 0.7, 0.5);
            this.envelopes[i].setRange(ENVELOPE_MAX_VOLUME_RANGE, 0);

            this.envelopes[i].setInput(this.oscillators[i]);
        }
    }


    playNote(midiNumber, noteName) { 
        const currentFrequency = MIDLE_C_FREQUENCY * Math.pow(2, midiNumber  / 31);

        let voiceIndex;

        if(this.activeVoices.length >= TOTAL_NUMBER_OF_VOICES) {
            const voiceToSteal = this.activeVoices.shift();
            this.envelopes[voiceToSteal].triggerRelease();

            voiceIndex = voiceToSteal;
        }
        else {
            for(let i = 0; i < TOTAL_NUMBER_OF_VOICES; i++) {
                if(!this.activeVoices.includes(i)) {
                    voiceIndex = i;                    
                    break;
                }
            }
        }

        this.oscillators[voiceIndex].freq(currentFrequency); 
        this.envelopes[voiceIndex].triggerAttack();

        this.activeVoices.push(voiceIndex);        
        this.noteToVoiceMap[noteName] = voiceIndex;         
    }


    releaseNote(noteName) {
        const voiceIndex = this.noteToVoiceMap[noteName];
        this.envelopes[voiceIndex].triggerRelease();

        const indexToRemove = this.activeVoices.indexOf(voiceIndex);
        if(indexToRemove != -1) this.activeVoices.splice(indexToRemove, 1);
        
        delete this.noteToVoiceMap[noteName];
    }


    setMasterVolume(ccValue) {
        this.masterVolume = Math.pow(ccValue / 127, 2);

        for(let i = 0; i < TOTAL_NUMBER_OF_VOICES; i++)                
            this.envelopes[i].mult(this.masterVolume);
    }


}