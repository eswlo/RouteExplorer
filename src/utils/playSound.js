import * as Tone from 'tone';

const osc = new Tone.Oscillator().toDestination();

export const playSoundForCell = (cellFreq) => {
    osc.frequency.value = cellFreq; // Set frequency based on cell value
    osc.start();
    osc.stop("+0.05"); // Stop after a short duration
};

// Optionally, create a function to start the audio context
export const startAudioContext = async () => {
    await Tone.start();
};
