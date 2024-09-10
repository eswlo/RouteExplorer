import React, { useCallback } from "react"
import { useState } from 'react'
import { nanoid } from "nanoid"
import Cell from "./Cell"

// a function that generate a grid
export default function Grid(props) {
    const WIDTH = 100;
    const HEIGHT = 40;
    const DEFAULTCOLOR = "white";
    const STARTCOLOR = "red";
    const ENDCOLOR = "blue";
    const BARRIERCOLOR = "black";
    const VISITEDCOLOR = "purple";
    const PATHCOLOR = "green";

    const [grid, setGrid] = useState(createNewGrid());
    const [doneSearch, setDoneSearch] = React.useState(false); // set True if search is finalized 
    const [isMouseDown, setIsMouseDown] = useState(false);

    const handleMouseUp = () => setIsMouseDown(false);

    function setNewStateAndColor(cell) {
        let newColor = "";
        let newState = "";

        // only set new colors and states when the clicked/hovered cell is a barrier or in default state.
        if (cell.state === "" || cell.state === "barriers") {
            if (props.radioState === "setStart") {
                newColor = STARTCOLOR;
                newState = "start";
            } else if (props.radioState === "setEnd") {
                newColor = ENDCOLOR;
                newState = "end";
            } else {
                newColor = BARRIERCOLOR;
                newState = "barriers";
            }
    
            // console.log(cell.x, cell.y);
    
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
    }

    const handleMouseDown = useCallback((cell) => {
        setIsMouseDown(true);
        setNewStateAndColor(cell);
    }, [isMouseDown, props.radioState]);

    const handleMouseOver = useCallback((cell) => {
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
        state: "",
        color: DEFAULTCOLOR
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
