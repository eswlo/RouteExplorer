const WIDTH = 100;
const HEIGHT = 45;

// STATES
const DEFAULTSTATE = "";
const STARTSTATE = "start";
const ENDSTATE = "end";
const BARRIERSTATE = "barrier";

// COLORS
const DEFAULTCOLOR = "#fffffe";
const STARTCOLOR = "yellow"; 
const ENDCOLOR = "yellow";
const PATHCOLOR = STARTCOLOR;
const BARRIERCOLOR = "#4e6e62";
const QUEUECOLOR = "#dee5de";
const VISITEDCOLOR = "#8e9bae";

// FREQUENCY
const STARTFREQ = 220;
const OCTAVE = 3;

// VOLUME
const VOL_MAX = -10;
const VOL_MIN = -60;
const VOL_DEFAULT = (VOL_MIN + VOL_MAX) /2;


export {
    WIDTH,
    HEIGHT,
    DEFAULTCOLOR,
    DEFAULTSTATE,
    STARTSTATE,
    ENDSTATE,
    BARRIERSTATE,
    STARTCOLOR,
    ENDCOLOR,
    BARRIERCOLOR,
    QUEUECOLOR,
    VISITEDCOLOR,
    PATHCOLOR,
    STARTFREQ,
    OCTAVE,
    VOL_MAX,
    VOL_MIN,
    VOL_DEFAULT
};