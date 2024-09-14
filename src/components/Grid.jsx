import React, { useCallback } from "react"
import { useState } from 'react'
import { nanoid } from "nanoid"
import Cell from "./Cell"
import PropTypes from 'prop-types';

// a function that generate a grid
export default function Grid(props) {
    const WIDTH = 100;
    const HEIGHT = 40;
    const DEFAULTCOLOR = "white";
    const DEFAULTSTATE = "";
    const STARTCOLOR = "red";
    const ENDCOLOR = "blue";
    const BARRIERCOLOR = "black";
    const VISITEDCOLOR = "purple";
    const PATHCOLOR = "green";

    const [grid, setGrid] = useState(createNewGrid());
    const [doneSearch, setDoneSearch] = React.useState(false); // set True if search is finalized 
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [startCell, setStartCell] = useState(null); 
    const [endCell, setEndCell] = useState(null);


    function updateGrid(cell, newState, newColor) {
        setGrid((prevGrid) => {
            return (
                prevGrid.map((oldCell) => {
                    if (oldCell.x == cell.x && oldCell.y == cell.y) {
                        return ({
                            ...oldCell,
                            state: newState,
                            color: newColor
                        })
                    } else {
                        return oldCell
                    }
                })
            )
        })
    }


    function setNewStateAndColor(cell) {
        let newColor = "";
        let newState = "";
        if (props.radioState === "setStart") {
            newState = "start";
            newColor = STARTCOLOR;
            if (startCell !== null) {
                updateGrid(startCell, DEFAULTSTATE, DEFAULTCOLOR);
            }
            setStartCell(cell);
            updateGrid(cell, newState, newColor);
        } else if (props.radioState === "setEnd") {
            newState = "end";
            newColor = ENDCOLOR;
            if (endCell !== null) {
                updateGrid(endCell, DEFAULTSTATE, DEFAULTCOLOR);
            }
            setEndCell(cell);
            updateGrid(cell, newState, newColor);
        } else {
            newColor = BARRIERCOLOR;
            newState = "barriers";
            if (cell.state === "") {
                updateGrid(cell, newState, newColor);
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
        // console.log("over");

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
        prev: null // set it later, eg {x: 1, y: 2} 
        })
    }

    // create a new grid with speficied HEIGHT and HEIGHT
    function createNewGrid() {
        const newGrid = [];
        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                newGrid.push(createNewCell(x, y));
            }
        }
        return newGrid;
    }

    // map all cells in grid to Cell component
    const cellElements = grid.map((cell) => {
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

    // define css style for grid
    const gridStyle = {
        display: 'grid',
        gridTemplate: `auto auto / repeat(${WIDTH}, 1fr)`,
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
};