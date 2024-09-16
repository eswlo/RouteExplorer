import React, { useCallback, useEffect } from "react"
import { useState } from 'react'
import Cell from "./Cell"
import PropTypes from 'prop-types';
import { WIDTH, HEIGHT } from '../utils/constants';



// a function that generate a grid
export default function Grid(props) {
    const [doneSearch, setDoneSearch] = React.useState(false); // set True if search is finalized 
    const [isMouseDown, setIsMouseDown] = useState(false);

    const handleMouseUp = () => setIsMouseDown(false);

    const handleMouseDown = useCallback((cell) => {
        // console.log("down");

        setIsMouseDown(true);
        props.setNewStateAndColor(cell);
    }, [isMouseDown, props.navRadioState]);

    const handleMouseOver = useCallback((cell) => {
        // console.log(cell.x, cell.y);

        if (isMouseDown && props.navRadioState === "setBarriers") {
            props.setNewStateAndColor(cell);
        }
    }, [isMouseDown, props.navRadioState]);


    // map all cells in grid to Cell component
    const cellElements = props.grid.map((row) => {
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
    navRadioState: PropTypes.string.isRequired,
    setNewStateAndColor: PropTypes.func.isRequired
};