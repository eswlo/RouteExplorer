import getDistance from "./getDistance";
import * as CONSTANTS from './constants';

// modify the conversion later!
export default function getVisitedCellFreq(curr, startCell, endCell) {
    const distBtwnCurrAndStart = getDistance(curr, startCell);
    const distBtwnStartAndEnd = getDistance(startCell, endCell);
    return (startCell.freq * ( (distBtwnCurrAndStart/distBtwnStartAndEnd) * (2 ** CONSTANTS.OCTAVE) ));
}