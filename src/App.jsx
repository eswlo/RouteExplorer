import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Main from './components/Main'
import { terminateSearch as aStarTerminateSearch, aStar, reset as aStarReset, setDelayTime as aStarsetDelayTime, pause as aStarPause } from './utils/aStar';
import { terminateSearch as dfsTerminateSearch, regularDFS, randomizedDFS, reset as dfsReset, setDelayTime as dfSsetDelayTime, pause as dfsPause } from "./utils/dfs";
import { terminateSearch as bfsTerminateSearch, regularBFS, randomizedBFS, reset as bfsReset, setDelayTime as bfsSetDelayTime, pause as bfsPause } from "./utils/bfs";
import { nanoid } from "nanoid"
import * as CONSTANTS from './utils/constants';
import { startAudioContext, adjustVolume } from './utils/playSound';


export default function App() {
  // states related to navbar
  const [navRadioState, setNavRadioState] = useState("setStart")
  const [exploreClicked, setExploreClicked] = useState(false);
  // manage radio btn checked states
  const [radioSelectedOption, setRadioSelectedOption] = useState("setStart");
  const [isSearchDone , setIsSearchDone] = useState(false)
  const [selectedAlgo, setSelectedAlgo] = useState('aStar');
  const [isReset, setIsReset] = useState(false);
  const [isTerminated, setIsTerminated] = useState(false);
  const [navSliderValue, setNavSliderValue] = useState(0);
  const [navVolumeValue, setNavVolumeValue] = useState(CONSTANTS.VOL_DEFAULT)
  const [isPause, setPause] = useState(false);

  // states related to grid
  const [grid, setGrid] = useState(createNewGrid());
  const [startCell, setStartCell] = useState(null); 
  const [endCell, setEndCell] = useState(null);

  const handleSearchDone = () => {
    // console.log("search done");
    handleTerminate();
    setIsSearchDone(true);
  }

  const handlePause = () => {
    // console.log(isPause);
    if (selectedAlgo === "aStar") {
      aStarPause();
    } else if (selectedAlgo === "regularDFS" || selectedAlgo === "randomizedDFS") {
      dfsPause();
    } else if (selectedAlgo === "regularBFS" || selectedAlgo === "randomizedBFS") {
      bfsPause();
    } 
    setPause(!isPause);
  }

  const reset = () => {
    // console.log("reset");
    aStarReset();
    dfsReset();
    bfsReset();
    setNavRadioState
    setNavRadioState("setStart");
    setRadioSelectedOption("setStart");
    setExploreClicked(false);
    setStartCell(null);
    setEndCell(null);
    setIsReset(true);
    setIsTerminated(false);
    setNavSliderValue(0);
    setIsSearchDone(false);
    setPause(false);
  }

  function handleReset() {
    reset();
  }

  // functions related to navbar
  function handleSelectedAlgo(algo) {
    // console.log(`algo: ${algo}`);
    setSelectedAlgo(algo);
    handleTerminate();
    handleReset();
  }

  async function handleExplore() {
    // console.log(`exploreClicked: ${exploreClicked}`);
    if (startCell && endCell) {
      // Ensure the AudioContext is started
      await startAudioContext();
      
      // console.log("set true");
      setExploreClicked(true);
      handleRadioChange("");
    } else {
      setExploreClicked(false);
    }
  }

  function handleTerminate() {
    // console.log("handleTerminate");
    setIsTerminated(true);

    if (selectedAlgo === "aStar") {
      aStarTerminateSearch();
    } else if (selectedAlgo === "regularDFS" || selectedAlgo === "randomizedDFS") {
      dfsTerminateSearch();
    } else if (selectedAlgo === "regularBFS" || selectedAlgo === "randomizedBFS") {
      bfsTerminateSearch();
    } 
  }


  function handleRadioChange(newRadioState) {
    // console.log(newRadioState);
    setNavRadioState(newRadioState);
    setRadioSelectedOption(newRadioState);
  }

  function handleNavRangeSlier(sliderValue) {
    setNavSliderValue(sliderValue);
    if (selectedAlgo === "aStar") {
      aStarsetDelayTime(sliderValue);
    } else if (selectedAlgo === "regularDFS" || selectedAlgo === "randomizedDFS") {
      dfSsetDelayTime(sliderValue);
    } else if (selectedAlgo === "regularBFS" || selectedAlgo === "randomizedBFS") {
      bfsSetDelayTime(sliderValue);
    } 
  }

  const handleNavVolumeSlider = (navVolumeValue) => {
    setNavVolumeValue(navVolumeValue);
    adjustVolume(navVolumeValue);
  }


  // funcsions for Main / Grid / Cell
  useEffect(() => {
    if (exploreClicked && startCell && endCell) {
      // console.log("start search");
      // console.log(exploreClicked);
      if (selectedAlgo === "aStar") {
        aStar(startCell, endCell, grid, updateGrid, handleSearchDone);
      } else if (selectedAlgo === "regularDFS") {
        regularDFS(startCell, endCell, grid, updateGrid, handleSearchDone);
      } else if (selectedAlgo === "randomizedDFS") {
        randomizedDFS(startCell, endCell, grid, updateGrid, handleSearchDone);
      } else if (selectedAlgo === "regularBFS") {
        regularBFS(startCell, endCell, grid, updateGrid, handleSearchDone);
      } else {
        randomizedBFS(startCell, endCell, grid, updateGrid, handleSearchDone);
      }
    } else {
        setExploreClicked(false);
    }
  }, [exploreClicked]);


  useEffect(() => {
    if (isReset) {
      // console.log('Refreshing grid');
      setGrid(createNewGrid());
      setIsReset(false);
    }
  }, [isReset]);



  function updateGrid(cellArray) {
    setGrid((prevGrid) => {
        const newGrid = prevGrid.map(row => [...row]); // deep copy
        // note that x indicates which col, and y indicates which row
        cellArray.forEach((cell) => {
            const row = cell.y;
            const col = cell.x;
            newGrid[row][col] = {...cell};
        });
        return newGrid;
    })
  }

  const setNewStateAndColor = (cell) => {
    // console.log("setnewstate");
    // console.log(exploreClicked);
    // console.log(radioSelectedOption);
    let newColor = "";
    let newState = "";
    if (radioSelectedOption !== "") {
      if (navRadioState === "setStart") {
        newState = CONSTANTS.STARTSTATE;
        newColor = CONSTANTS.STARTCOLOR;
        if (cell.state !== CONSTANTS.ENDSTATE) {
            if (startCell !== null) { // update grid by resetting old start cell
                updateGrid([{
                    ...startCell,
                    state: CONSTANTS.DEFAULTSTATE,
                    color: CONSTANTS.DEFAULTCOLOR,
                    freq: 0
                }]);
            }
            setStartCell({ // set new start cell
                ...cell,
                state: newState,
                color: newColor,
                freq: CONSTANTS.STARTFREQ
            });
            updateGrid([{ // update grid with the new start cell 
                ...cell,
                state: newState,
                color: newColor,
                freq: CONSTANTS.STARTFREQ
            }]);
        }
      } else if (navRadioState === "setEnd") {
        newState = CONSTANTS.ENDSTATE;
        newColor = CONSTANTS.ENDCOLOR;
        if (cell.state !== CONSTANTS.STARTSTATE) {
            if (endCell !== null) {
                updateGrid([{ // update grid by resetting old end cell
                    ...endCell,
                    state: CONSTANTS.DEFAULTSTATE,
                    color: CONSTANTS.DEFAULTCOLOR,
                    freq: 0
                }]);            
            }
            setEndCell({ // set new end cell
                ...cell,
                state: newState,
                color: newColor,
                freq: CONSTANTS.STARTFREQ * (2**CONSTANTS.OCTAVE)
            });
            updateGrid([{ // update grid with the end start cell 
                ...cell,
                state: newState,
                color: newColor,
                freq: CONSTANTS.STARTFREQ * (2**CONSTANTS.OCTAVE)
            }]);
        }
      } else if (navRadioState === "setBarriers") {
        if (cell.state === CONSTANTS.DEFAULTSTATE) {
            updateGrid([{
                ...cell,
                state: CONSTANTS.BARRIERSTATE,
                color: CONSTANTS.BARRIERCOLOR
            }]);              
        } else if (cell.state === CONSTANTS.BARRIERSTATE) {
            updateGrid([{
                ...cell,
                state: CONSTANTS.DEFAULTSTATE,
                color: CONSTANTS.DEFAULTCOLOR
            }]);  
        }
      } else {
        //
      }
    }
  }

  // create and return a new cell object
  function createNewCell(x, y) {
    // console.log(x, y);
    return ({
    id: nanoid(),
    x: x,
    y: y, 
    state: CONSTANTS.DEFAULTSTATE, // 4 states: start, end, barrier, and default (blank)
    color: CONSTANTS.DEFAULTCOLOR,
    isQueued: false,
    isVisited: false,
    prev: null, // set the parent cell leter during search
    g: Infinity,
    h: Infinity,
    f: Infinity,
    freq: 0,
    makeSound: false
    })
  }

  // create a new grid with speficied HEIGHT and HEIGHT
  function createNewGrid() {
    const newGrid = [];
    for (let y = 0; y < CONSTANTS.HEIGHT; y++) {
        const row = [];
        for (let x = 0; x < CONSTANTS.WIDTH; x++) {
            row.push(createNewCell(x, y));
        }
        newGrid.push(row);
    }
    return newGrid;
  }


  return (
    <div>
          <Navbar 
            handleRadioChange={handleRadioChange}
            handleExplore={handleExplore}
            handleTerminate={handleTerminate}
            handleReset={handleReset}
            isTerminated={isTerminated}
            radioSelectedOption={radioSelectedOption}
            startCell={startCell}
            endCell={endCell}
            exploreClicked={exploreClicked}
            selectedAlgo={selectedAlgo} 
            handleSelectedAlgo={handleSelectedAlgo}
            handleNavRangeSlier={handleNavRangeSlier}
            navSliderValue={navSliderValue}
            handleNavVolumeSlider={handleNavVolumeSlider}
            navVolumeValue={navVolumeValue}
            isSearchDone={isSearchDone}
            handlePause={handlePause}
            isPause={isPause}
            />
          <Main 
            navRadioState={navRadioState}
            setCanExplore={setExploreClicked}
            setNewStateAndColor={setNewStateAndColor}
            grid={grid}
          />
    </div>
  )
}

