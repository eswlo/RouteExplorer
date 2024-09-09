import React from "react"
import { useState } from 'react'
import { nanoid } from "nanoid"

export default function Grid() {
    const WIDTH = 50;
    const HEIGHT = 50;

    const [grid, setGrid] = useState(createNewGrid());
    const [doneSearch, setDoneSearch] = React.useState(false); // set True if search is finalized 

    // create and return a new cell object
    function createNewCell(x, y) {
        console.log(x, y);
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

    return (
        <div>
            <p>Grid</p>    
        </div>
    )
}
