let w, h;

let mySound;
// play stop pause
let playBtn;
let stopBtn;
let pauseBtn;
// skip to start skip to end
let skipStartBtn;
let skipEndBtn;
// loop on off
let loopBtn;
let loopStatus = false;
// sliders volume pan rate
let sliderVol;
let sliderRate;
let sliderPan;
// record
let recordBtn;
let mic;
let recorder;
let soundFile;
let recordState = 0;
// misc
let customFont;
let peaks;
let lastPos;
// tracks
let track1;
let track2;
let track3;

let track1Btn;
let track2Btn;
let track3Btn;

// effects
let reverb;
let reverbTimeSlider;
let reverbDecaySlider;
let reverDryWetSlider;
let reverAmpSlider;


/**
It must include the three attached songs, and it must include a way for selecting which song the users want to listen to.

The player must include the following controls:
    - Buttons: Pause, Play, Stop, Skip to Start, Skip to End and Loop On/Off.
    - Sliders: Volume, Pan and Rate.

Investigate how to display the waveform of the song and add a playhead to indicate where the player is in the song.
Investigate how you could design a non-linear slider for controlling the volume of the player, more adequate with human loudness perception. 
a·exp(b·x) and substitute the values from 20*log10(x)

In the previous video we have seen how to apply a reverb effect to a sound using p5.js and p5.sound.

Repeat the same application, designing a user interface to control the reverb parameters.
*/

Logger.useDefaults();

function preload() {
    soundFormats('wav', 'mp3', 'ogg');
    track1 = loadSound('assets/Exercise_Sounds/hello-user-bright-cheery-intro-music.wav');
    track2 = loadSound('assets/Exercise_Sounds/tattle-vintage-synth-industrial-loop.wav');
    track3 = loadSound('assets/Exercise_Sounds/wax-track-industrial-idm-score-music.mp3');
    mySound = track1;
    customFont = loadFont('assets/ARCADECLASSIC.TTF');
}

function setup() {
    w = windowWidth;
    h = windowHeight;
    createCanvas(windowWidth, windowHeight);

    mySound.playMode('restart');
    fft = new p5.FFT();
    reverb = new p5.Reverb();

    //mySound.disconnect();
    reverb.process(mySound, 10, 3);

    peaks = mySound.getPeaks();

    // Mic & Record
    mic = new p5.AudioIn();
    mic.start();
    recorder = new p5.SoundRecorder();
    recorder.setInput(mic);
    soundFile = new p5.SoundFile();

    // Buttons
    playBtn = createButton('Play');
    stopBtn = createButton('Stop');
    pauseBtn = createButton('Pause');
    skipStartBtn = createButton('|<');
    skipEndBtn = createButton('>|');
    loopBtn = createButton('Loop');

    // Track buttons
    track1Btn = createButton('Track 1');
    track2Btn = createButton('Track 2');
    track3Btn = createButton('Track 3');

    sliderVol = createSlider(0, 60, 30, 0.1);
    sliderRate = createSlider(-2, 3, 1, 0.01);
    sliderPan = createSlider(-1, 1, 0, 0.01);
    recordBtn = createButton('REC');

    // Reverb 
    reverbTimeSlider = new KnobSlider(1, 10, 'Reverb \nDuration');
    reverbDecaySlider = new KnobSlider(0, 100, 'Reverb \nDecay');
    reverDryWetSlider = new VerticalSlider(0, 100, 'Dry Wet');
    reverAmpSlider = new VerticalSlider(0, 100, 'Output Level');

    // Misc
    positionElements();

    // Button events
    playBtn.mousePressed(playPressed);
    pauseBtn.mousePressed(pausePressed);
    stopBtn.mousePressed(stopPressed);
    skipStartBtn.mousePressed(skipStartPressed);
    skipEndBtn.mousePressed(skipEndPressed);
    loopBtn.mousePressed(loopPressed);

    track1Btn.mousePressed(() => switchTrack(1));
    track2Btn.mousePressed(() => switchTrack(2));
    track3Btn.mousePressed(() => switchTrack(3));

    recordBtn.mousePressed(recordPressed);

}

function switchTrack(track) {
    track1Btn.style('background-color', 'white');
    track2Btn.style('background-color', 'white');
    track3Btn.style('background-color', 'white');
    if (mySound.isPlaying()) {
        mySound.stop();
    }
    switch (track) {
        case 1:
            mySound = track1;
            peaks = mySound.getPeaks();
            Logger.info('switched to track 1');
            track1Btn.style('background-color', 'green');
            break;
        case 2:
            mySound = track2;
            peaks = mySound.getPeaks();
            Logger.info('switched to track 2');
            track2Btn.style('background-color', 'green');
            break;
        case 3:
            mySound = track3;
            peaks = mySound.getPeaks();
            Logger.info('switched to track 3');
            track3Btn.style('background-color', 'green');
            break;
    }
    mySound.play();
}

function positionElements() {
    let x = w / 8;
    let y = h / 20;

    // first row
    playBtn.position(x, y);
    pauseBtn.position(x * 2, y);
    stopBtn.position(x * 3, y);
    skipStartBtn.position(x * 4, y);
    skipEndBtn.position(x * 5, y);
    loopBtn.position(x * 6, y);

    // second row
    sliderVol.position(x + sliderVol.width / 2, h / 10 + 20);
    sliderRate.position(x + sliderRate.width / 2, h / 10 + 40);
    sliderPan.position(x + sliderPan.width / 2, h / 10 + 60);
    recordBtn.position(x - recordBtn.width, y);

    track1Btn.style('background-color', 'green');
    track1Btn.position(x * 4, y * 2 + 26);
    track2Btn.position(x * 5, y * 2 + 26);
    track3Btn.position(x * 6, y * 2 + 26);

    // change the dimensions of the buttons
    playBtn.size(x, y);
    pauseBtn.size(x, y);
    stopBtn.size(x, y);
    skipStartBtn.size(x, y);
    skipEndBtn.size(x, y);
    loopBtn.size(x, y);
    track1Btn.size(x, y);
    track2Btn.size(x, y);
    track3Btn.size(x, y);

    // reverb 
    reverbTimeSlider.position(x * 2, y * 16, x * 2)
    reverbDecaySlider.position(x * 3, y * 16, x * 2)
    reverDryWetSlider.position(x * 2, y * 18)
    reverAmpSlider.position(x * 3, y * 18)
}

function stopPressed() {
    if (mySound.isPlaying()) {
        mySound.stop();
        stopBtn.style('background-color', 'red');
        pauseBtn.style('background-color', 'white');
        playBtn.style('background-color', 'white');
    }
}
function playPressed() {
    mySound.play();  //loop
    stopBtn.style('background-color', 'white');
    pauseBtn.style('background-color', 'white');
    playBtn.style('background-color', 'Green');
}

function pausePressed() {
    if (mySound.isPlaying()) {
        Logger.info('pausePressed');
        mySound.pause();
        pauseBtn.style('background-color', 'yellow');
    }
}

function skipStartPressed() {
    Logger.info('skipStartPressed');
    mySound.jump(0);
}

function skipEndPressed() {
    Logger.info('skipEndPressed');
    mySound.jump(mySound.duration() - 0.1);
    if (!mySound.isLooping()) playBtn.style('background-color', 'white')
}

function loopPressed() {
    Logger.info('loopPressed');
    if (!mySound.isLooping()) {
        loopBtn.style('background-color', 'green');
        mySound.setLoop(true);
        Logger.info("looping status true")
    } else {
        loopBtn.style('background-color', 'white');
        mySound.setLoop(false);
        Logger.info("looping status false")
    }
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

function jumpSound() {
    let len = mySound.duration();
    let t = random(len);
    mySound.jump(t);
    console.log(t);
}


function draw() {
    background(220);

    let dB = sliderVol.value();
    let volume = pow(10, dB / 20);// Set the volume
    mySound.setVolume(volume);
    mySound.rate(sliderRate.value());
    mySound.pan(sliderPan.value());

    fill(0);
    textAlign(CENTER, CENTER);
    textFont(customFont);
    x = w / 8;
    y = h / 20;
    textSize(32);
    text("Juan  Music  Player", w / 2, y / 2);
    textSize(14);
    text('volume', x + 30, h / 10 + 20 + 5);
    text('rate', x + 30, h / 10 + 40 + 5);
    text('pan', x + 30, h / 10 + 60 + 5);

    let waveform = fft.waveform();
    rect(x, y * 4, x * 6, y * 2)
    noFill();
    beginShape();
    stroke(255, 0, 0); // waveform is red
    for (let i = 0; i < waveform.length; i++) {
        let wave_x = map(i, 0, waveform.length, x, x * 7);
        let wave_y = map(waveform[i], -1, 1, y * 4, y * 6);
        vertex(wave_x, wave_y);
    }
    endShape();
    stroke(0);

    rect(x, y * 6, x * 6, y * 2);
    for (var i = 0; i < peaks.length; i++) {
        // Map the x-coordinate from the range [0, peaks.length] to the range [x, x + x * 6]
        var line_x = map(i, 0, peaks.length, x, x + x * 6);
        // Map the y-coordinates from the range [-1, 1] to the range [y * 6, y * 8]
        var line_y1 = map(peaks[i], -1, 1, y * 6, y * 8);
        var line_y2 = map(-peaks[i], -1, 1, y * 6, y * 8);
        line(line_x, y * 7, line_x, line_y1);  // Line going up from middle
        line(line_x, y * 7, line_x, line_y2);  // Line going down from middle
    }


    if (mySound.isPlaying()) {
        let time = mySound.currentTime();
        let duration = mySound.duration();
        let pos = map(time, 0, duration, x, x * 7);
        lastPos = pos;
        line(pos, y * 8, pos, y * 6);
    }

    strokeWeight(3)

    if (lastPos && lastPos < x * 6) {
        console.log(lastPos);
        line(lastPos, y * 8, lastPos, y * 6);
    }
    strokeWeight(1)

    // Low Pass square
    rect(x, y * 8, x * 3, y * 6);

    // Reverb square
    rect(x, y * 14, x * 3, y * 6);
    reverbTimeSlider.display();
    reverbDecaySlider.display();
    reverDryWetSlider.display();
    reverAmpSlider.display();


}

function mousePressed() {
    reverbTimeSlider.mousePressed();
    reverbDecaySlider.mousePressed();
    reverDryWetSlider.mousePressed();
    reverAmpSlider.mousePressed();
}

function mouseReleased() {
    reverbTimeSlider.mouseReleased();
    reverbDecaySlider.mouseReleased();
    reverDryWetSlider.mouseReleased();
    reverAmpSlider.mouseReleased();

}

function mouseDragged() {
    reverbTimeSlider.mouseDragged();
    reverbDecaySlider.mouseDragged();
    reverDryWetSlider.mouseDragged();
    reverAmpSlider.mouseDragged();
}


function windowResized() {
    w = windowWidth;
    h = windowHeight;
    resizeCanvas(windowWidth, windowHeight);
    positionElements();
}

class KnobSlider {
    constructor(minValue, maxValue, name) {
        this.name = name;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.value = minValue;
        this.centerX = 0; // Center X of knob, to be set with position method
        this.centerY = 0; // Center Y of knob, to be set with position method
        this.knobSize = 60;
        this.dragging = false;
        this.angle = -HALF_PI; // Start angle at the top (12 o'clock position)
    }

    position(x, y) {
        this.centerX = x;
        this.centerY = y;
        this.updateKnobPosition();
    }

    setValue(newValue) {
        this.value = constrain(newValue, this.minValue, this.maxValue);
        this.updateKnobPosition();
    }

    getValue() {
        return this.value;
    }

    updateKnobPosition() {
        // Map the value to an angle between 0 and TWO_PI (full circle)
        this.angle = map(this.value, this.minValue, this.maxValue, -HALF_PI, -HALF_PI + TWO_PI);
    }

    display() {
        // Draw knob
        fill(180);
        // title of knob
        textSize(18);
        text(this.name, this.centerX, this.centerY - 55);
        if (this.dragging) {
            fill(100);
        }
        ellipse(this.centerX, this.centerY, this.knobSize);
        fill(180);
        text(round(this.value), this.centerX, this.centerY + 45);

        // Draw line from center of knob
        let lineX = this.centerX + cos(this.angle) * (this.knobSize / 2);
        let lineY = this.centerY + sin(this.angle) * (this.knobSize / 2);
        stroke(0);
        strokeWeight(2);
        line(this.centerX, this.centerY, lineX, lineY);
    }

    mousePressed() {
        if (dist(mouseX, mouseY, this.centerX, this.centerY) < this.knobSize / 2) {
            this.dragging = true;
        }
    }

    mouseReleased() {
        this.dragging = false;
    }

    mouseDragged() {
        if (this.dragging) {
            // Calculate the angle to the mouse position
            let mouseAngle = atan2(mouseY - this.centerY, mouseX - this.centerX);
            // Normalize the angle to between -PI and PI
            if (mouseAngle < -HALF_PI) {
                mouseAngle += TWO_PI;
            }
            // Set the value based on the angle
            this.setValue(map(mouseAngle, -HALF_PI, -HALF_PI + TWO_PI, this.minValue, this.maxValue));
        }
    }
}

class VerticalSlider {
    constructor(minValue, maxValue, name) {
      this.name = name;
      this.minValue = minValue;
      this.maxValue = maxValue;
      this.value = minValue;
      this.baseX = 0; // Base X of slider, to be set with position method
      this.baseY = 0; // Base Y of slider, to be set with position method
      this.sliderWidth = 14; // Width of the slider
      this.sliderHeight = 100; // Height of the slider
      this.handleHeight = 10; // Height of the handle
      this.dragging = false;
    }
  
    position(x, y) {
      this.baseX = x - 7;
      this.baseY = y;
      this.updateHandlePosition();
    }
  
    setValue(newValue) {
      this.value = constrain(newValue, this.minValue, this.maxValue);
      this.updateHandlePosition();
    }
  
    getValue() {
      return this.value;
    }
  
    updateHandlePosition() {
      // Map the value to a position within the slider's height
      this.handleY = map(this.value, this.minValue, this.maxValue, this.baseY, this.baseY + this.sliderHeight - this.handleHeight);
    }
  
    display() {
      // Draw slider base
      fill(240);
      rect(this.baseX, this.baseY, this.sliderWidth, this.sliderHeight);
  
      // Draw slider handle
      fill(180);
      if (this.dragging) {
        fill(100);
      }
      rect(this.baseX-4, this.handleY, this.sliderWidth+8, this.handleHeight);
  
      // Draw the name and value of the slider
      fill(0);
      stroke(0);
      textSize(16);
      text(this.name, this.baseX + 8, this.baseY - 10);
      text(round(this.value), this.baseX + this.sliderWidth + 5, this.baseY + this.sliderHeight - 5);
    }
  
    mousePressed() {
      if (mouseX >= this.baseX && mouseX <= this.baseX + this.sliderWidth &&
          mouseY >= this.handleY && mouseY <= this.handleY + this.handleHeight) {
        this.dragging = true;
      }
    }
  
    mouseReleased() {
      this.dragging = false;
    }
  
    mouseDragged() {
      if (this.dragging) {
        // Constrain the handle's Y position within the slider's range
        this.handleY = constrain(mouseY, this.baseY, this.baseY + this.sliderHeight - this.handleHeight);
        // Set the value based on the handle's position
        this.setValue(map(this.handleY, this.baseY, this.baseY + this.sliderHeight - this.handleHeight, this.minValue, this.maxValue));
      }
    }
  }
  