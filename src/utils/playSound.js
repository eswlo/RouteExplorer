import * as Tone from 'tone';
import * as CONSTANTS from './constants';



const ampEnv = new Tone.AmplitudeEnvelope(0.01, 0.0, 0.05, 0.05);
const osc = new Tone.Oscillator().connect(ampEnv).toDestination();

let soundVolume = CONSTANTS.VOL_DEFAULT;

export function adjustVolume(newVol) {
    soundVolume =newVol;
}

export const playSoundForCell = (cellFreq) => {
    osc.frequency.value = cellFreq; // Set frequency based on cell value
    osc.volume.value = soundVolume;
    osc.start();
    ampEnv.triggerAttackRelease(0.05);
    osc.stop("+0.07"); // Stop after a short duration
};

// Optionally, create a function to start the audio context
export const startAudioContext = async () => {
    await Tone.start();
};
