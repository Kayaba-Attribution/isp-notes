## Learning Objectives

+ Use an audio editor and write simple programs to work with digital audio signals
+ Explain the relevance of bit depth and sampling rates for digital audio signals and select appropriate paramters for different types of signals
+ Describe the characteristics of sound waves and how they are perceived by humans

Intelligent signal processing involves capturing, storing and playing, processing and extracting information from various signals found in the world using a computer system


## SOUND

generation-propagation-reception

compression <-> rarefaction

physics = mechanical energy that needs medium to propagate, it travels in form of mechanical waves

physiology/psychology = reception of these sound waves and their procession by the brain

## characteristics sound waves

+ speed
    + more dense medium = speed increase 
    + more temperatire = speed increase
    + gases < liquids < solids

> The greater the elasticity and the lower the density, the faster sound travels in a medium.

+ **wavelength** is the distance between two crests/trough of the wave
+ **amplitute** maximum change in pressure or density that a vibrating object produces in surrounding air
+ **frequency** =  number of crests of a wave that move past a given point in a given unit of time (1s)
+ frequency is in hertz (Hz) cycles per second
+ **period** is the time it takes for a cycle 

+ T = 1/f Period = 1 / freq
+ f = 1/T Freq = 1 / period 
+ v = f * λ velocity = frequency * wavelength

##  Human sound perception characteristics

+ **pitch** classify lower-higher, high f high pitch, non-linear, after 1kHz a greater change in f is needded to increase the pitch
+ **loudness** quiet-loud, based on amplitude, Pa or uPa, 20 uPa = humans >20 Pa = discomfort

20,000 uPa -> dbSPL
SPL = 20log(P, Pref)db
dbSPL = 20log(20000/20)
= 20log(1000)
20,000 uPa = 60 dbSPL

+ change of 3 dB SPL indicates a doubling of the physical measurement of intensity
+ human perception increase of 10 dB sounds about twice as loud

+ ear is more sensitive to high-mid frequencies than to bass frequencies
+ we can hear more  sounds at lower decibel levels 1 kHz and 5 kHz
+ human ear interpret changes in loudness within a logarithmic scale
+ don't design linear volume control

+ **timbre** shape of the waveform extra info to distingish sounds with same pitch and loundess

**pure tone** is a sound that can be represented by a sinusoidal waveform (single f)

## Human spectrum
Infrasounds < 20-20,000 Hz < Ultrasound

# Capture Sound

microphone converts air pressure into a faint electrical signal, this is amplified by a pre amplifier, finally the **ADC** (analog to digital converter) measures the incoming voltage n number of times/second and assigns a numerical value to it

+ **Sampling Rate**: faster we sample = better quality more memory size
CD 44.1kHz
+ ADC measures the amplitude of the incoming waveform some number of times every second and assigns a numerical value to the amplitude.

assigning an amplitude value to the sample is called **quantizing** and the number of amplitude values available to the ADC is called the **sample resolution**

Nyquist-Shannon's sampling theorem
digital audio can contain no frequency that is higher than:
    + Nyquist frequency =  sample rate / 2
    + that would be the max f in that media
**sampling rate must be at least 2x the original frequency**
original 60Hz = sample rate must be > 120Hz

**quantizing** is assignment of a specific value to the measured amplitude 

ADC generates artificial frequencies in a process called aliasing
+ **anti-aliasing filter** that eliminates frequencies above the Nyquist frequency between the preamp and the ADC

**bit depth**: bit # used to record the Amplitud,e measurement, more bits = w,aveform more accurately measured, more memory [8,16,24,3] CD is 16bits

2-bit resolution is 2^2=4 possible values (Quantization level=4)

**clipping** ADC cannot asign singal to correct easurement, results in flat tops/bottoms = distortion
> make sure input level meter doesnt arrive to 0

resolution expressed in bytes (16 bits = 2 bytes, 24 bits = 3 bytes, 32-bits = 4 bytes)

44,100 samples/second x 2 bytes/sample = 88,200 bytes/second ~ 90 kB/second
90 kB/second x 60 seconds/minute = 5,400 kB/minute ~ 5 MB/minute
5 MB/minute x 2 channels (left and right) = 10 MB/minute 

**signal-to-error ratio**: overall signal to the sampling error

+ Lossless Compression -50%
+ Lossy Compression, one-tenth the size

# Play sound

digital signal is converted into analoge electrical singnal using a **DAC** (digital to analog converter), then an amplifier is used, and a speaker play it

## Digital audio representation 

> Time Domain

y-axis is the amplitude [-1,1], dBFS, Sample Values
x-axis is the time Decimal, Samples, FPS
signal waveform

dBFS, full scale
Nomalized Value = 0 = dBFS = 20*log(abs(0)) = -infinite dBFS
Nomalized Value = 1 = dBFS = 20*log(abs(1)) = 0 dBFS
Nomalized Value = -1 = dBFS = 20*log(abs(-1)) = 0 dBFS

When you save a file in a lossy file format, you choose a data rate, or bitrate,
for the resultant file. Common bitrates include 128 kbps (kilobits per second) and
256 kbps. For many people, an MP3 or AAC encoded at 256 kbps will be largely
indistinguishable from the original CD-quality recordings. In addition, noisy listening
environments and mediocre-quality audio equipment make any compromise due to
compression largely irrelevant for casual listening. However, in audio recording, editing,
mixing, and mastering only uncompressed audio is used.
Approximate file sizes in megabytes per minute for lossy compressed audio can be
calculated as follows:
Bitrate in kbps .;- 8 bits/byte x 60 seconds/minute .;- 1,024 kB/MB 

# Week 2

**Learning Objectives:**

+ Use an audio editor and write simple programs to work with digital audio signals
+ Explain the relevance of bit depth and sampling rates for digital audio signals and select appropriate paramters for different types of signals
+ Describe the characteristics of sound waves and how they are perceived by humans

Audacity tips:

+ Loop command: space+shift
+ Import track: shift+alt+i
+ Record: shift+r 
+ save project does it in wav

https://manual.audacityteam.org/man/tutorials_for_audacity.html

For recording:
+ sample rate 44.1 basic 48k more usedd

wav<mp3<ogg

ogg 5 to 10 is a 2x jump in file size

wav 16 bit to 24 is still very reasonable size <10MB

mp3 can get as big as ogg

No audible difference between all of them, WAV is the best for me 

https://greenteapress.com/thinkdsp/thinkdsp.pdf

https://www.coursera.org/learn/uol-cm3065-intelligent-signal-processing/lecture/Yfqi2/2-001-audio-editing-in-audacity