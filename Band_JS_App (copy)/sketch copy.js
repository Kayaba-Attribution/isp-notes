let mySound;
let playBtn;
let jumpBtn;
let sliderVol;
let sliderRate;
let sliderPan;
let customFont;
let mic;
let w, h;


function setup() {
    w = windowWidth;
    h = windowHeight;
    createCanvas(windowWidth, windowHeight, WEBGL);

    mic = new p5.AudioIn();
    mySound.playMode('restart');

    playBtn = createButton('play');
    sliderVol = createSlider(0, 2, 1, 0.01);
    sliderRate = createSlider(-2, 2, 1, 0.01);
    sliderPan = createSlider(-1, 1, 0, 0.01);
    jumpBtn = createButton('jump');

    positionElements();

    playBtn.mousePressed(playPressed);
    jumpBtn.mousePressed(jumpSound);
}

function positionElements() {
    playBtn.position(w / 2 - jumpBtn.width / 2, h / 10 - 10);
    sliderVol.position(w / 2 - sliderVol.width / 2, h / 10 + 20);
    sliderRate.position(w / 2 - sliderRate.width / 2, h / 10 + 40);
    sliderPan.position(w / 2 - sliderPan.width / 2, h / 10 + 60);
    jumpBtn.position(w / 2 - jumpBtn.width / 2, h / 10 + 80);
}

function preload() {
    soundFormats('wav', 'mp3', 'ogg');
    mySound = loadSound('boom.wav');
    customFont = loadFont('assets/ARCADECLASSIC.TTF');
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
    text('rate', w / 2 - sliderRate.width, h / 10 + 40+ 5);
    text('pan', w / 2 - sliderPan.width, h / 10 + 60 + 5);

    console.log(mouseX, mouseY);

}

function windowResized() {
    w = windowWidth;
    h = windowHeight;
    resizeCanvas(windowWidth, windowHeight);
    positionElements();
}