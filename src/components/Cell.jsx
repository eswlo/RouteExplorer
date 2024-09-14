import React from "react"

// memoizes the rendering of the functional component cell to avoide unnecessary re-renders.
const Cell = React.memo((props) => {
    
    let cellBorderRadius = "0px";
    let cellHeight = "0.8rem";
    let cellWidth = "0.8rem";

    if (props.cell.state === "start" || props.cell.state === "end") {
        cellBorderRadius = "30px";
    } 

    // define css style for cell
    const cellStyle = {
        height: cellHeight,
        width: cellWidth,
        backgroundColor: props.cell.color,
        borderRadius: cellBorderRadius
    }

    return (
        <div 
            className="cell" 
            style={cellStyle} 
            onMouseDown={props.onMouseDown}
            onMouseUp={props.onMouseUp}
            onMouseOver={props.onMouseOver}
        /> 
    )
});

Cell.displayName = 'Cell';
export default Cell;



