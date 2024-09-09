import React from "react"
import { useState } from 'react'
import { nanoid } from "nanoid"
import Cell from "./Cell"

// a function that generate a grid
export default function Grid() {
    const WIDTH = 100;
    const HEIGHT = 40;

    const [grid, setGrid] = useState(createNewGrid());
    const [doneSearch, setDoneSearch] = React.useState(false); // set True if search is finalized 

    // create and return a new cell object
    function createNewCell(x, y) {
        // console.log(x, y);
        return ({
        id: nanoid(),
        x: x,
        y: y, 
        isStart: false,
        isEnd: false,
        isBorder: false,
        isVisited: false,
        isPath: false
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
