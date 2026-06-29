class SheetMusic {

    constructor(){}


    updateScore() {
        this.drawMusic();
    }


    drawMusic() {
        const chordToVisualize = new Set([...notesPressed, ...currentChord, ...sustainedChord]);

        if(chordToVisualize.size > 0) {
            const VF = Vex.Flow;
            const scoreEngraver = new VF.Factory({renderer: { elementId: 'score', width: 200, height: 250 }});

            const score = scoreEngraver.EasyScore();
            const system = scoreEngraver.System({ width: 150 });

            let trebleVoices = [];
            let bassVoices = [];

            let isTrebleDataContent = false;
            let isBassDataContent = false;

            for(const item of chordToVisualize) {
                const note = item + '/w';
                const noteOctave = parseInt(item.slice(-1));

                if(noteOctave >= 4) {
                    isTrebleDataContent = true;
                    trebleVoices.push(score.voice(score.notes(note, {clef: 'treble'})));
                } else {
                    isBassDataContent = true;
                    bassVoices.push(score.voice(score.notes(note, {clef: 'bass'})));
                }
            }
            
            if(isTrebleDataContent){
                system.addStave({ voices: trebleVoices }).addClef('treble').setEndBarType(VF.Barline.type.DOUBLE);
            }

            if(isBassDataContent) {
                system.addStave({ voices: bassVoices }).addClef('bass').setEndBarType(VF.Barline.type.DOUBLE);
            }

            if(isTrebleDataContent && isBassDataContent) {
                system.addConnector(); 
            }

           scoreEngraver.draw();
        }
    }




}