import React from "react"

// memoizes the rendering of the functional component cell to avoide unnecessary re-renders.
const Cell = React.memo((props) => {

    // define css style for cell
    const cellStyle = {
        backgroundColor: props.cell.color
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

export default Cell;



