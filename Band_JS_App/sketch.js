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
// sliders volume
let sliderVol;
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
let reverbReverseBtn;
let performanceProtect;

let pass;
let passCutoffSlider;
let passResonanceSlider;
let passDryWetSlider;
let passAmpSlider;

let passLowBtn;
let passHighBtn;
let passBandBtn;

let distortion;
let distortionAmountSlider;
let distortionOversampleSlider;
let distortionDryWetSlider;
let distortionAmpSlider;

let comp;
let compAttackSlider;
let compKneeSlider;
let compReleaseSlider;
let compRatioSlider;
let compThresholdSlider;
let compDryWetSlider;
let compAmpSlider;

let effectsSliders = [
    //...
];
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
    track1 = loadSound('assets/poem.wav');
    //track1 = loadSound('assets/Exercise_Sounds/hello-user-bright-cheery-intro-music.wav');
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
    fftOriginal = new p5.FFT();
    fftProcessed = new p5.FFT();

    pass = new p5.Filter();
    pass.setType('lowpass');
    distortion = new p5.Distortion(0, 'none');
    comp = new p5.Compressor();
    reverb = new p5.Reverb(1, 3);

    fftOriginal.setInput(mySound);

    mySound.disconnect();
    pass.disconnect();
    distortion.disconnect();
    comp.disconnect();
    mySound.connect(pass);
    pass.connect(distortion);
    distortion.connect(comp);
    comp.connect(reverb);
    fftProcessed.setInput(reverb);

    // Record
    recorder = new p5.SoundRecorder();
    soundFile = new p5.SoundFile();
    recorder.setInput(reverb);


    peaks = mySound.getPeaks();



    // Buttons
    playBtn = createButton('Play');
    stopBtn = createButton('Stop');
    pauseBtn = createButton('Pause');
    skipStartBtn = createButton('|<');
    skipEndBtn = createButton('>|');
    loopBtn = createButton('Loop');

    passLowBtn = createButton('Low');
    passHighBtn = createButton('High');
    passBandBtn = createButton('Band');

    // Track buttons
    track1Btn = createButton('Track 1');
    track2Btn = createButton('Track 2');
    track3Btn = createButton('Track 3');

    sliderVol = new VerticalSlider(0, 100, 'Master \nVolume', 50);
    recordBtn = createButton('REC');

    // Reverb 
    reverbTimeSlider = new KnobSlider(0, 10, 'Duration', 0);
    reverbDecaySlider = new KnobSlider(0, 10, 'Decay', 0);
    reverDryWetSlider = new VerticalSlider(0, 100, 'Dry Wet', 0);
    reverAmpSlider = new VerticalSlider(0, 100, 'Output Level', 100);
    reverbReverseBtn = createButton('Reverse');

    // Low High Pass
    passCutoffSlider = new KnobSlider(0, 10000, 'Cutoff', 5000);
    passResonanceSlider = new KnobSlider(0, 100, 'Resonance', 15);
    passDryWetSlider = new VerticalSlider(0, 100, 'Dry Wet', 80);
    passAmpSlider = new VerticalSlider(0, 100, 'Output Level', 100);

    // Distortion
    distortionAmountSlider = new KnobSlider(0, 100, 'Amount');
    distortionOversampleSlider = new KnobSlider(0, 2, 'Oversample');
    distortionDryWetSlider = new VerticalSlider(0, 100, 'Dry Wet', 80);
    distortionAmpSlider = new VerticalSlider(0, 100, 'Output Level', 100);

    // Compressor
    compAttackSlider = new KnobSlider(0, 100, 'Attack', 0.003);
    compKneeSlider = new KnobSlider(0, 40, 'Knee', 30);
    compReleaseSlider = new KnobSlider(0, 100, 'Release', 25);
    compRatioSlider = new KnobSlider(1, 20, 'Ratio', 12);
    compThresholdSlider = new KnobSlider(0, 100, 'Threshold', 24);
    compDryWetSlider = new VerticalSlider(0, 100, 'Dry Wet', 80);
    compAmpSlider = new VerticalSlider(0, 100, 'Output Level', 100);

    effectsSliders.push(
        reverbTimeSlider,
        reverbDecaySlider,
        reverDryWetSlider,
        reverAmpSlider,
        passCutoffSlider,
        passResonanceSlider,
        passDryWetSlider,
        passAmpSlider,
        distortionAmountSlider,
        distortionOversampleSlider,
        distortionDryWetSlider,
        distortionAmpSlider,
        compAttackSlider,
        compKneeSlider,
        compReleaseSlider,
        compRatioSlider,
        compThresholdSlider,
        compDryWetSlider,
        compAmpSlider,
        sliderVol
    );

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

    passLowBtn.mousePressed(() => pass.setType('lowpass'));
    passHighBtn.mousePressed(() => pass.setType('highpass'));
    passBandBtn.mousePressed(() => pass.setType('bandpass'));

    reverbReverseBtn.mousePressed(() => {
        if (reverb._reverse) {
            reverb._reverse = false;
            reverbReverseBtn.style('background-color', 'white');
        } else {
            reverb._reverse = true;
            reverbReverseBtn.style('background-color', 'green');
        }
    });

}

function mapToExponential(value, min, max, expMin, expMax) {
    // Convert the linear range into a 0-1 range
    let normalized = (value - min) / (max - min);
    // Use an exponential function to map the normalized value
    let expValue = expMin * Math.pow(expMax / expMin, normalized);
    return expValue;
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
    skipEndBtn.position(x * 4 + x / 2, y);
    recordBtn.position(x * 5, y);
    loopBtn.position(x * 6, y);

    passLowBtn.position(x*3 + 25, y * 10 - 20);
    passHighBtn.position(x*3 + 25, y * 10 + 10);
    passBandBtn.position(x*3 + 25, y * 10 + 40);

    passLowBtn.size(x/2, 20);
    passHighBtn.size(x/2, 20);
    passBandBtn.size(x/2, 20);

    // change the dimensions of the buttons
    sliderVol.position(x - 45, y * 2 - 6);
    playBtn.size(x, y);
    pauseBtn.size(x, y);
    stopBtn.size(x, y);
    skipStartBtn.size(x / 2, y);
    skipEndBtn.size(x / 2, y);
    loopBtn.size(x, y);
    recordBtn.size(x, y);
    track1Btn.size(x, y);
    track2Btn.size(x, y);
    track3Btn.size(x, y);
    reverbReverseBtn.size(x, y);

    // pass
    passCutoffSlider.position(x * 2, y * 7 + 30, x * 2)
    passResonanceSlider.position(x * 3, y * 7 + 30, x * 2)
    passDryWetSlider.position(x * 2, y * 9 + 20)
    passAmpSlider.position(x * 3, y * 9 + 20)

    // compressor
    compAttackSlider.position(x * 4 + 45, y * 7 + 30, x * 2)
    compKneeSlider.position(x * 5 + 45, y * 7 + 30, x * 2)
    compReleaseSlider.position(x * 6 + 45, y * 7 + 30, x * 2)
    compRatioSlider.position(x * 4 + 45, y * 10, x * 2)
    compThresholdSlider.position(x * 4 + 45, y * 12 + 20, x * 2)
    compDryWetSlider.position(x * 5 + 35, y * 10 + 45)
    compAmpSlider.position(x * 6 + 32, y * 10 + 45)


    // distortion
    distortionAmountSlider.position(x * 5, y * 16 - 30, x * 2)
    distortionOversampleSlider.position(x * 6, y * 16 - 30, x * 2)
    distortionDryWetSlider.position(x * 5, y * 17)
    distortionAmpSlider.position(x * 6, y * 17)


    // reverb 
    reverbTimeSlider.position(x * 2, y * 14, x * 2)
    reverbDecaySlider.position(x * 3, y * 14, x * 2)
    reverDryWetSlider.position(x * 2, y * 17)
    reverAmpSlider.position(x * 3, y * 17)
    reverbReverseBtn.position(x * 2, y * 15 + 20)

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
    Logger.info('audio context state: ' + getAudioContext().state);
    Logger.info('recordState: ' + recordState);
    if (getAudioContext().state !== 'running') {
        getAudioContext().resume();
        recordBtn.html('record');
    }

    if (recordState === 0) {
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

function drawSpectrum(spectrum, rectX, rectY, rectWidth, rectHeight) {
    // Draw the rectangle outline in black
    stroke(0); // Black color for the rectangle outline
    noFill();
    rect(rectX, rectY, rectWidth, rectHeight);

    let binWidth = rectWidth / spectrum.length;

    // Draw the spectrum lines in red
    for (let i = 0; i < spectrum.length; i++) {
        let amplitude = spectrum[i]; // Get amplitude for this bin
        let mappedAmplitude = map(amplitude, 0, 255, 0, rectHeight); // Map amplitude to rect height

        let binX = rectX + i * binWidth;
        let y1 = rectY + rectHeight; // Bottom of the rectangle
        let y2 = y1 - mappedAmplitude; // Y position based on amplitude

        stroke(5, 71, 42); // Set the stroke color to red for the spectrum lines
        line(binX, y1, binX, y2);
    }
}


function draw() {
    background(220);

    // TODO: resonance log scale
    let passCutoff = passCutoffSlider.getValue();
    let passResonance = passResonanceSlider.getValue();
    let passDryWet = passDryWetSlider.getValue();
    let passAmp = passAmpSlider.getValue();
    passResonance = map(passResonance, 0, 100, 0.001, 5);
    passDryWet = map(passDryWet, 0, 100, 0, 1);
    passAmp = map(passAmp, 0, 100, 0, 1);

    pass.freq(passCutoff);
    pass.res(passResonance);
    pass.drywet(passDryWet);
    pass.amp(passAmp);

    // console.table({
    //     'Pass Cutoff Frequency': passCutoff,
    //     'Pass Resonance': passResonance,
    //     'Pass Dry/Wet': passDryWet,
    //     'Pass Amplitude': passAmp
    // });

    let distortionAmount = distortionAmountSlider.getValue();
    let distortionOversample = distortionOversampleSlider.getValue();
    let distortionDryWet = distortionDryWetSlider.getValue();
    let distortionAmp = distortionAmpSlider.getValue();
    distortionAmount = map(distortionAmount, 0, 100, 0, 1);
    if (distortionOversample < 0.5) {
        distortionOversample = 'none';
    } else if (distortionOversample < 1.5) {
        distortionOversample = '2x';
    } else {
        distortionOversample = '4x';
    }
    distortionDryWet = map(distortionDryWet, 0, 100, 0, 1);
    distortionAmp = map(distortionAmp, 0, 100, 0, 1);

    distortion.set(distortionAmount, distortionOversample);
    distortion.drywet(distortionDryWet);
    distortion.amp(distortionAmp);

    // console.table({
    //     'Distortion Amount': distortionAmount,
    //     'Distortion Oversample': distortionOversample,
    //     'Distortion Dry/Wet': distortionDryWet,
    //     'Distortion Amplitude': distortionAmp
    // });

    let compAttack = compAttackSlider.getValue();
    let compKnee = compKneeSlider.getValue();
    let compRelease = compReleaseSlider.getValue();
    let compRatio = compRatioSlider.getValue();
    let compThreshold = compThresholdSlider.getValue();
    let compDryWet = compDryWetSlider.getValue();
    let compAmp = compAmpSlider.getValue();
    compAmp = map(compAmp, 0, 100, 0, 1);
    // attack    default = .003, range 0 - 1
    // knee      default = 30, range 0 - 40 on slider
    // release   default = .25, range 0 - 1
    // ratio     default = 12, range 1 - 20 on slider
    // threshold default = -24, range 0 - 100
    compThreshold = map(compThreshold, 0, 100, -100, 0);
    compAttack = mapToExponential(compAttack, 0, 100, 0.003, 1);
    compRelease = map(compRelease, 0, 100, 0, 1);

    comp.set(compAttack, compKnee, compRatio, compThreshold, compRelease);
    comp.drywet(compDryWet);
    comp.amp(compAmp);

    // console.table({
    //     'Comp Attack': compAttack,
    //     'Comp Knee': compKnee,
    //     'Comp Release': compRelease,
    //     'Comp Ratio': compRatio,
    //     'Comp Threshold': compThreshold,
    //     'Comp Dry/Wet': compDryWet,
    //     'Comp Amplitude': compAmp
    // });

    // ! AMPS are being overloaded



    let reverbTime = reverbTimeSlider.getValue();
    let reverbDecay = reverbDecaySlider.getValue();
    let reverDryWet = reverDryWetSlider.getValue();
    let reverAmp = reverAmpSlider.getValue();
    reverAmp = map(reverAmp, 0, 100, 0, 1);
    if (performanceProtect == null) performanceProtect = reverbTime + reverbDecay;
    if (reverbTime + reverbDecay != performanceProtect) {
        console.log('reverbTime + reverbDecay != performanceProtect');
        performanceProtect = reverbTime + reverbDecay
        //reverb.set(reverbTime, reverbDecay);
    }

    reverb.drywet(reverDryWet);
    reverb.amp(reverAmp);

    console.table({
        'Reverb Time': reverbTime,
        'Reverb Decay': reverbDecay,
        'Reverb Reverse': reverb._reverse,
        'Reverb Dry/Wet': reverDryWet,
        'Reverb Amplitude': reverAmp
    });

    let dB = sliderVol.getValue();
    dB = map(dB, 0, 100, -60, 0)
    console.log(dB);
    let volume = pow(10, dB / 20);// Set the volume
    mySound.setVolume(volume);


    fill(0);
    textAlign(CENTER, CENTER);
    textFont(customFont);
    x = w / 8;
    y = h / 20;
    textSize(32);
    text("Juan  Music  Player", w / 2, y / 2);
    textSize(14);

    // Original spectrum
    let spectrumOriginal = fftOriginal.analyze();
    drawSpectrum(spectrumOriginal, x, y * 2, x * 3, y * 2);

    // Processed spectrum
    let spectrumProcessed = fftProcessed.analyze();
    drawSpectrum(spectrumProcessed, x * 4, y * 2, x * 3, y * 2);


    // beginShape();
    // stroke(255, 0, 0); // waveform is red
    // for (let i = 0; i < waveform.length; i++) {
    //     let wave_x = map(i, 0, waveform.length, x, x * 7);
    //     let wave_y = map(waveform[i], -1, 1, y - 50, y * 6);
    //     vertex(wave_x, wave_y);
    // }
    // endShape();
    stroke(0);

    rect(x, y * 4, x * 6, y * 2);
    for (var i = 0; i < peaks.length; i++) {
        // Map the x-coordinate from the range [0, peaks.length] to the range [x, x + x * 6]
        var line_x = map(i, 0, peaks.length, x, x + x * 6);
        // Map the y-coordinates from the range [-1, 1] to the range [y * 6, y * 8]
        var line_y1 = map(peaks[i], -1, 1, y * 4, y * 6);
        var line_y2 = map(-peaks[i], -1, 1, y * 4, y * 6);
        line(line_x, y * 5, line_x, line_y1);  // Line going up from middle
        line(line_x, y * 5, line_x, line_y2);  // Line going down from middle
    }


    if (mySound.isPlaying()) {
        let time = mySound.currentTime();
        let duration = mySound.duration();
        let pos = map(time, 0, duration, x, x * 7);
        lastPos = pos;
        line(pos, y * 4, pos, y * 6);
    }

    strokeWeight(3)

    if (lastPos && lastPos < x * 6) {
        line(lastPos, y * 4, lastPos, y * 6);
    }
    strokeWeight(1)


    // Low Pass square
    rect(x, y * 6, x * 3, y * 6);
    push();
    fill(0);
    translate(x + 25, y * 8 + 40);
    rotate(-HALF_PI);
    textSize(24);
    text("Low  High  Pass  Filter", 0, 0);
    pop();


    // Compressor square
    rect(x * 4, y * 6, x * 3, y * 8 - 20);
    textSize(28);
    push();
    fill(0);
    text("Dynamic \nCompressor", x * 6, y * 9 + 30);
    pop();

    // Reverb square
    rect(x, y * 12, x * 3, y * 8);
    push();
    fill(0);
    translate(x + 25, y * 16);
    rotate(-HALF_PI);
    textSize(36);
    text("Reverb", 0, 0);
    pop();

    // Distortion square
    rect(x * 4, y * 14 - 20, x * 3, y * 6 + 20);
    push();
    fill(0);
    translate(x * 4 + 25, y * 16 + 35);
    rotate(-HALF_PI);
    textSize(24);
    text("Waveshaper    Distortion", 0, 0);
    pop();

    for (let slider of effectsSliders) {
        slider.display();
    }
}

function mousePressed() {
    for (let slider of effectsSliders) {
        slider.mousePressed();
    }
}

function mouseReleased() {
    for (let slider of effectsSliders) {
        slider.mouseReleased();
    }
}

function mouseDragged() {
    let dragging = false;
    for (let slider of effectsSliders) {
        if (!dragging) { // Only drag one slider at a time
            slider.mouseDragged();
            dragging = dragging || slider.dragging; // If any slider is being dragged, set dragging to true
        }
    }
}


function windowResized() {
    w = windowWidth;
    h = windowHeight;
    resizeCanvas(windowWidth, windowHeight);
    positionElements();
}

class KnobSlider {
    constructor(minValue, maxValue, name, defaultValue = minValue) {
        this.name = name;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.value = minValue;
        this.centerX = 0; // Center X of knob, to be set with position method
        this.centerY = 0; // Center Y of knob, to be set with position method
        this.knobSize = 60;
        this.dragging = false;
        this.angle = -HALF_PI; // Start angle at the top (12 o'clock position)
        this.setValue(defaultValue);
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
        strokeWeight(2)
        // Draw knob
        fill(180);
        // title of knob
        textSize(18);
        if (this.name === 'Threshold') textSize(15);
        text(this.name, this.centerX, this.centerY - 45);
        if (this.dragging) {
            fill(100);
        }
        ellipse(this.centerX, this.centerY, this.knobSize);
        fill(180);
        text(round(this.value), this.centerX, this.centerY + 40);

        // Draw line from center of knob
        let lineX = this.centerX + cos(this.angle) * (this.knobSize / 2);
        let lineY = this.centerY + sin(this.angle) * (this.knobSize / 2);
        strokeWeight(2);
        line(this.centerX, this.centerY, lineX, lineY);
        strokeWeight(1)
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
    constructor(minValue, maxValue, name, defaultValue = minValue) {
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
        this.setValue(defaultValue)
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
        this.handleY = map(this.value, this.minValue, this.maxValue, this.baseY + this.sliderHeight - this.handleHeight, this.baseY);
    }

    display() {
        // Draw slider base
        strokeWeight(1)
        fill(240);
        rect(this.baseX, this.baseY, this.sliderWidth, this.sliderHeight);

        // Draw slider handle
        fill(180);
        if (this.dragging) {
            fill(100);
        }
        rect(this.baseX - 4, this.handleY, this.sliderWidth + 8, this.handleHeight);

        // Draw the name and value of the slider
        fill(0);
        textSize(16);
        // check if this name includes '\n'
        if (this.name.includes('\n')) {
            text(this.name, this.baseX + 8, this.baseY - 28);
        } else {
            text(this.name, this.baseX + 8, this.baseY - 20);
        }
        text(round(this.value), this.baseX + this.sliderWidth / 2, this.baseY + this.sliderHeight + 8);
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
            // Set the value based on the handle's position, inversely mapping the position to the value
            this.setValue(map(this.handleY, this.baseY + this.sliderHeight - this.handleHeight, this.baseY, this.minValue, this.maxValue));
        }
    }

}
