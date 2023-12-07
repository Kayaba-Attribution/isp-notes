let w, h;

let mySound;
let playBtn;
let recordBtn;
let jumpBtn;
let sliderVol;
let sliderRate;
let sliderPan;
let customFont;

let mic;
let recorder;
let soundFile;
let recordState = 0;

/**
It must include the three attached songs, and it must include a way for selecting which song the users want to listen to.

The player must include the following controls:
    - Buttons: Pause, Play, Stop, Skip to Start, Skip to End and Loop On/Off.
    - Sliders: Volume, Pan and Rate.

Investigate how to display the waveform of the song and add a playhead to indicate where the player is in the song.
Investigate how you could design a non-linear slider for controlling the volume of the player, more adequate with human loudness perception. 
a·exp(b·x) and substitute the values from 20*log10(x)
*/

Logger.useDefaults();

function setup() {
    w = windowWidth;
    h = windowHeight;
    createCanvas(windowWidth, windowHeight);

    mySound.playMode('restart');

    // Mic & Record
    mic = new p5.AudioIn();
    mic.start();
    recorder = new p5.SoundRecorder();
    recorder.setInput(mic);
    soundFile = new p5.SoundFile();

    playBtn = createButton('play');
    sliderVol = createSlider(0, 2, 1, 0.01);
    sliderRate = createSlider(-2, 2, 1, 0.01);
    sliderPan = createSlider(-1, 1, 0, 0.01);
    jumpBtn = createButton('jump');
    recordBtn = createButton('record');

    positionElements();

    playBtn.mousePressed(playPressed);
    jumpBtn.mousePressed(jumpSound);
    recordBtn.mousePressed(recordPressed);
}

function positionElements() {
    playBtn.position(w / 2 - jumpBtn.width / 2, h / 10 - 10);
    sliderVol.position(w / 2 - sliderVol.width / 2, h / 10 + 20);
    sliderRate.position(w / 2 - sliderRate.width / 2, h / 10 + 40);
    sliderPan.position(w / 2 - sliderPan.width / 2, h / 10 + 60);
    jumpBtn.position(w / 2 - jumpBtn.width / 2, h / 10 + 80);
    recordBtn.position(w / 2 - recordBtn.width / 2, h / 10 + 100);
}

function preload() {
    soundFormats('wav', 'mp3', 'ogg');
    mySound = loadSound('boom.wav');
    customFont = loadFont('assets/ARCADECLASSIC.TTF');
}

function recordPressed() {
    Logger.info('recordPressed, mic enabled: ' + mic.enabled);
    Logger.info('audio context state: ' + getAudioContext().state);
    Logger.info('recordState: ' + recordState);
    if (getAudioContext().state !== 'running') {
        getAudioContext().resume();
        recordBtn.html('record');
    }

    if (recordState === 0 && mic.enabled) {
        recordBtn.html('recording');
        recordBtn.style('background-color', 'red');
        // record to our p5.SoundFile
        recorder.record(soundFile);
        recordState++;
    } else if (recordState === 1) {
        recordBtn.html('Play and Save');
        recordBtn.style('background-color', 'green');
        recorder.stop();
        recordState++;
    } else if (recordState === 2) {
        recordBtn.html('record');
        recordBtn.style('background-color', 'white');
        soundFile.play(); // play the result!
        save(soundFile, 'mySound.wav');
        recordState = 0;
    }

}

function playPressed() {
    if (mySound.isPlaying()) {
        mySound.stop(); // pause
        playBtn.html('play');
    } else {
        mySound.play();  //loop
        playBtn.html('stop');
    }
}

function jumpSound() {
    let len = mySound.duration();
    let t = random(len);
    mySound.jump(t);
    console.log(t);
}


function draw() {
    mySound.setVolume(sliderVol.value());
    mySound.rate(sliderRate.value());
    mySound.pan(sliderPan.value());

    fill(0);
    textAlign(CENTER, CENTER);
    textFont(customFont);
    text('volume', w / 2 - sliderVol.width, h / 10 + 20 + 5);
    text('rate', w / 2 - sliderRate.width, h / 10 + 40 + 5);
    text('pan', w / 2 - sliderPan.width, h / 10 + 60 + 5);


}

function windowResized() {
    w = windowWidth;
    h = windowHeight;
    resizeCanvas(windowWidth, windowHeight);
    positionElements();
}