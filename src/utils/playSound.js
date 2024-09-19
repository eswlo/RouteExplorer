import * as Tone from 'tone';

const ampEnv = new Tone.AmplitudeEnvelope(0.01, 0.0, 0.05, 0.05);
const osc = new Tone.Oscillator({volume: -16}).connect(ampEnv).toDestination();


export const playSoundForCell = (cellFreq) => {
    osc.frequency.value = cellFreq; // Set frequency based on cell value
    osc.start();
    ampEnv.triggerAttackRelease(0.05);
    osc.stop("+0.07"); // Stop after a short duration
};

// Optionally, create a function to start the audio context
export const startAudioContext = async () => {
    await Tone.start();
};
