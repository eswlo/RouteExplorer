import React, { useCallback, useEffect } from "react"
import { useState } from 'react'
import { nanoid } from "nanoid"
import Cell from "./Cell"
import PropTypes from 'prop-types';
import aStar from '../utils/aStar';
import { 
    WIDTH, 
    HEIGHT, 
    DEFAULTCOLOR, 
    DEFAULTSTATE, 
    STARTSTATE,
    ENDSTATE,
    BARRIERSTATE,
    STARTCOLOR, 
    ENDCOLOR, 
    BARRIERCOLOR, } from '../utils/constants';



// a function that generate a grid
export default function Grid(props) {

    const [grid, setGrid] = useState(createNewGrid());
    const [doneSearch, setDoneSearch] = React.useState(false); // set True if search is finalized 
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [startCell, setStartCell] = useState(null); 
    const [endCell, setEndCell] = useState(null);

    useEffect(() => {
        if (props.canExplore) {
            aStar(startCell, endCell, grid, updateGrid)
        }
    }, [props.canExplore]);


    function updateGrid(cellArray) {
        setGrid((prevGrid) => {
            const newGrid = prevGrid.map(row => [...row]); // deep copy
            // note that x indicates which col, and y indicates which row
            cellArray.forEach((cell) => {
                const row = cell.y;
                const col = cell.x;
                newGrid[row][col] = cell;
            });
            return newGrid;
        })
    }

    function setNewStateAndColor(cell) {
        let newColor = "";
        let newState = "";
        if (props.radioState === "setStart") {
            newState = STARTSTATE;
            newColor = STARTCOLOR;
            if (cell.state !== ENDSTATE) {
                if (startCell !== null) {
                    updateGrid([{
                        ...startCell,
                        state: DEFAULTSTATE,
                        color: DEFAULTCOLOR
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
        } else if (props.radioState === "setEnd") {
            newState = ENDSTATE;
            newColor = ENDCOLOR;
            if (cell.state !== STARTSTATE) {
                if (endCell !== null) {
                    updateGrid([{
                        ...endCell,
                        state: DEFAULTSTATE,
                        color: DEFAULTCOLOR
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
            if (cell.state === DEFAULTSTATE) {
                updateGrid([{
                    ...cell,
                    state: BARRIERSTATE,
                    color: BARRIERCOLOR
                }]);              
            } else if (cell.state === BARRIERSTATE) {
                updateGrid([{
                    ...cell,
                    state: DEFAULTSTATE,
                    color: DEFAULTCOLOR
                }]);  
            }
        }
    }

    const handleMouseUp = () => setIsMouseDown(false);

    const handleMouseDown = useCallback((cell) => {
        // console.log("down");

        setIsMouseDown(true);
        setNewStateAndColor(cell);
    }, [isMouseDown, props.radioState]);

    const handleMouseOver = useCallback((cell) => {
        // console.log(cell.x, cell.y);

        if (isMouseDown && props.radioState === "setBarriers") {
            setNewStateAndColor(cell);
        }
    }, [isMouseDown, props.radioState]);


    // create and return a new cell object
    function createNewCell(x, y) {
        // console.log(x, y);
        return ({
        id: nanoid(),
        x: x,
        y: y, 
        state: DEFAULTSTATE, // 4 states: start, end, barrier, and default (blank)
        color: DEFAULTCOLOR,
        visited: false,
        prev: null, // set the parent cell leter during search
        g: Infinity,
        h: Infinity,
        f: Infinity
        })
    }

    // create a new grid with speficied HEIGHT and HEIGHT
    function createNewGrid() {
        const newGrid = [];
        for (let y = 0; y < HEIGHT; y++) {
            const row = [];
            for (let x = 0; x < WIDTH; x++) {
                row.push(createNewCell(x, y));
            }
            newGrid.push(row);
        }
        return newGrid;
    }

    // map all cells in grid to Cell component
    const cellElements = grid.map((row) => {
        return (
            row.map((cell) => {
                return (
                    <Cell 
                    key={cell.id}
                    cell={cell}
                    onMouseUp={handleMouseUp}
                    onMouseDown={() => handleMouseDown(cell)}
                    onMouseOver={() => handleMouseOver(cell)}
                    />
                ) 
            })
        )
    })

    // define css style for grid
    const gridStyle = {
        display: 'grid',
        gridTemplate: `repeat(${HEIGHT}, auto) / repeat(${WIDTH}, 1fr)`,
        gap: '0px',
    }

    return (
        <div className="grid" style={gridStyle}>
            {cellElements}  
        </div>
    )
}

Grid.propTypes = {
    radioState: PropTypes.string.isRequired,
    canExplore: PropTypes.bool.isRequired
};