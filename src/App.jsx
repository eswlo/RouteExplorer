import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Main from './components/Main'
import { terminateSearch as aStarTerminateSearch, aStar, reset as aStarReset } from './utils/aStar';
import { terminateSearch as dfsTerminateSearch, standardDFS, randomizedDFS, reset as dfsReset } from "./utils/dfs";
import { terminateSearch as bfsTerminateSearch, standardBFS, randomizedBFS, reset as bfsReset } from "./utils/bfs";
import { nanoid } from "nanoid"
import * as CONSTANTS from './utils/constants';


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

  // states related to grid
  const [grid, setGrid] = useState(createNewGrid());
  const [startCell, setStartCell] = useState(null); 
  const [endCell, setEndCell] = useState(null);

  const reset = () => {
    console.log("reset");
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
  }

  function handleReset() {
    reset();
  }

  // functions related to navbar
  function handleSelectedAlgo(algo) {
    console.log(`algo: ${algo}`);
    setSelectedAlgo(algo);
    handleTerminate();
    handleReset();
  }

  function handleExplore() {
    console.log(`exploreClicked: ${exploreClicked}`);
    if (startCell && endCell) {
      setExploreClicked(true);
    } else {
      setExploreClicked(false);
    }
  }

    function handleTerminate() {
      console.log("handleTerminate");
      aStarTerminateSearch();
      dfsTerminateSearch();
      bfsTerminateSearch();
      setIsTerminated(true);
    }


  function handleRadioChange(newRadioState) {
    // console.log(newRadioState);
    setNavRadioState(newRadioState);
    setRadioSelectedOption(newRadioState);
  }


  // funcsions for Main / Grid / Cell
  useEffect(() => {
    if (exploreClicked && startCell && endCell) {
      if (selectedAlgo === "aStar") {
        aStar(startCell, endCell, grid, updateGrid);
      } else if (selectedAlgo === "standardDFS") {
        standardDFS(startCell, endCell, grid, updateGrid);
      } else if (selectedAlgo === "randomizedDFS") {
        randomizedDFS(startCell, endCell, grid, updateGrid);
      } else if (selectedAlgo === "standardBFS") {
        standardBFS(startCell, endCell, grid, updateGrid);
      } else {
        randomizedBFS(startCell, endCell, grid, updateGrid);

      }
    } else {
        setExploreClicked(false);
    }
  }, [exploreClicked]);


  useEffect(() => {
    if (isReset) {
      console.log('Refreshing grid');
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
    let newColor = "";
    let newState = "";
    if (navRadioState === "setStart") {
        newState = CONSTANTS.STARTSTATE;
        newColor = CONSTANTS.STARTCOLOR;
        if (cell.state !== CONSTANTS.ENDSTATE) {
            if (startCell !== null) {
                updateGrid([{
                    ...startCell,
                    state: CONSTANTS.DEFAULTSTATE,
                    color: CONSTANTS.DEFAULTCOLOR
                }]);
            }
            setStartCell({
                ...cell,
                state: newState,
                color: newColor
            });
            updateGrid([{
                ...cell,
                state: newState,
                color: newColor
            }]);
        }
    } else if (navRadioState === "setEnd") {
        newState = CONSTANTS.ENDSTATE;
        newColor = CONSTANTS.ENDCOLOR;
        if (cell.state !== CONSTANTS.STARTSTATE) {
            if (endCell !== null) {
                updateGrid([{
                    ...endCell,
                    state: CONSTANTS.DEFAULTSTATE,
                    color: CONSTANTS.DEFAULTCOLOR
                }]);            
            }
            setEndCell({
                ...cell,
                state: newState,
                color: newColor
            });
            updateGrid([{
                ...cell,
                state: newState,
                color: newColor
            }]);
        }
    } else {
        // cell.state === DEFAULTSTATE 
        //     ? updateGrid({
        //         ...cell,
        //         state: BARRIERSTATE,
        //         color: BARRIERCOLOR}) 
        //     : updateGrid({
        //         ...cell,
        //         state: DEFAULTSTATE,
        //         color: DEFAULTCOLOR
        //     })
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
    f: Infinity
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

