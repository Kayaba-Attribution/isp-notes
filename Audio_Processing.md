## Audio Processing

noisy rich signal = lots of frequencies
sample is a snapshot of an audio waveform

Amplification = change the amplitude less/more volume [multiply by scalar]

Normalization:
	+ Analysis: find the peak, find out how much it can scale without clipping
	+ Scaling: proportional
	
Fade In: gradually increase amp, linear ramp, 0<->1

Fade can remove clicks

Low pass filters: allow low f while blocking high f muffled
High pass filter: allow high f while blocking low f tinea
Notch: filter a particular notch Q-value: how wide the notch is

Echo: repeat the singal
	+ delay time: time between sounds per sec
	+ delay factor: factor for how much echo go downs by
Phasing: overlay signal on itself with slight delay

Dynamic Range Effects:

Gate: block when quiet (remove noise bits of the signal)
	+ threshold high-> only loud signals get trhu
	+ level reduction-> if not get pass the gate what is the reduction
	
Compression: compresses the dynamic range, flat out quiet and loud amps, boosts quiet signals
	+ ratio how strong
	
Distortion: if amp > x, amp = 0.75, flat square

Spatialisatoin, reverberation
many complex echos, simulate acustic space


