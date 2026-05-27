class SheetMusic {

    constructor(){}



    updateScore() {
        this.drawMusic();
    }



    drawMusic() {
        const chordToVisualize = new Set([...notesPresed, ...currentChord, ...sustainedChord]);

        if(chordToVisualize.size > 0) {
            const VF = Vex.Flow;
            const scoreEngraver = new VF.Factory({renderer: { elementId: 'score', width: 200, height: 250 }});

            const score = scoreEngraver.EasyScore();
            const system = scoreEngraver.System({ width: 150 });

            let trebleVoices = [];
            let bassVoices = [];


            for(const item of chordToVisualize) {
                const note = item + '/w';
                const noteOctave = parseInt(item.slice(-1));



               //console.log(noteOctave)


                //TODO: populate trebleVoices or bassVoices base on noteOctave

                trebleVoices.push(score.voice(score.notes(note, {clef: 'treble'})));

                
            }
            

        
            
            system.addStave({ voices: trebleVoices }).addClef('treble').setEndBarType(VF.Barline.type.DOUBLE);
            
            //system.addStave({ voices: bassVoices }).addClef('bass').setEndBarType(VF.Barline.type.DOUBLE);


            //system.addConnector(); 
            scoreEngraver.draw();


        }

    }




}