const NOTE_DATA_PATH = '../json/pc_data.json';
const COLOR_MAP_PATH = '../json/color_map.json';
const MIDLE_C_FREQUENCY = 261.63;
const ENVELOPE_MAX_VOLUME_RANGE = 0.3;
const TOTAL_NUMBER_OF_VOICES = 10;
const SLIDER_ONE_CC_NUMBER = 48;

const pcData = new Array(31);
fillPcDataArray();

const colorMapping = {};
getColorMapping();

let isMidiReady = false;
let isScoreShowed = false;
let midiOutput = null;
let keyOffset = 0;

const notesPressed = new Set();
const currentChord = new Set();
const sustainedChord = new Set();


function fillPcDataArray(){
    fetch(NOTE_DATA_PATH)
    .then(response => response.json())  
    .then(data => {
        for(const key in data){ 
        const index = data[key].value;
        pcData[index] = { note: key, color: data[key].color, pc: data[key].value, noteName: data[key].note};
        }
    })
    .catch(error => console.error('Error loading pitch class data JSON:', error));
}


function getColorMapping(){
    fetch(COLOR_MAP_PATH)
    .then(response => response.json())
    .then(data => {
        for(const key in data){
            colorMapping[key] = data[key];
        }
    })
    .catch(error => console.error('Error loading color mapping JSON:', error));
}


function mod(n, m) {
    return ((n % m) + m) % m;
}


function addToNotesPressed(note){
    notesPressed.add(note);
}


function removeFromnotesPressed(note){
    notesPressed.delete(note);
}


function addNoteToChord(note) {
    currentChord.add(note);
}


function removeNoteFromChord(note) {
    currentChord.delete(note);
}


function addToSustained(note) {
    sustainedChord.add(note);
}


function clearSustained() {
    sustainedChord.clear();
}