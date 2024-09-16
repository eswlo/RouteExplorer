import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Main from './components/Main'
import aStar from './utils/aStar';
import { standardDFS, randomizedDFS } from "./utils/dfs";
import { standardBFS, randomizedBFS } from "./utils/bfs";
import { nanoid } from "nanoid"
import * as CONSTANTS from './utils/constants';


export default function App() {
  // states related to navbar
  const [navRadioState, setNavRadioState] = useState("setStart")
  const [exploreClicked, setExploreClicked] = useState(false);
  // manage radio btn checked states
  const [radioSelectedOption, setRadioSelectedOption] = useState("setStart");

  // states related to grid
  const [grid, setGrid] = useState(createNewGrid());
  const [startCell, setStartCell] = useState(null); 
  const [endCell, setEndCell] = useState(null);

  // functions related to navbar
  function handleExplore() {
    console.log(`exploreClicked: ${exploreClicked}`);
    if (startCell && endCell) {
      setExploreClicked(true);
    } else {
      setExploreClicked(false);
    }
  }

  function handleRest() {
    setNavRadioState("setStart");
    setRadioSelectedOption("setStart");
    setExploreClicked(false);
    setGrid(createNewGrid());
    setStartCell(null);
    setEndCell(null);
  }

  function handleRadioChange(newRadioState) {
    // console.log(newRadioState);
    setNavRadioState(newRadioState);
    setRadioSelectedOption(newRadioState);
  }


  // funcsions for Main / Grid / Cell
  useEffect(() => {
    if (exploreClicked && startCell && endCell) {
        // aStar(startCell, endCell, grid, updateGrid);
        // standardDFS(startCell, endCell, grid, updateGrid);
        randomizedDFS(startCell, endCell, grid, updateGrid);
        // standardBFS(startCell, endCell, grid, updateGrid);
        // randomizedBFS(startCell, endCell, grid, updateGrid);
    } else {
        setExploreClicked(false);
    }
  }, [exploreClicked]);

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
            handleRest={handleRest}
            radioSelectedOption={radioSelectedOption}
            startCell={startCell}
            endCell={endCell}
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

