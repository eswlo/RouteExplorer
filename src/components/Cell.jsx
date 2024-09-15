import React from "react"
import PropTypes from 'prop-types';
import * as CONSTANTS from '../utils/constants';


// memoizes the rendering of the functional component cell to avoide unnecessary re-renders.
const Cell = React.memo((props) => {
    
    let cellBorderRadius = "0px";
    let cellHeight = "0.8rem";
    let cellWidth = "0.8rem";
    let cellBorder = "0.5px inset";


    if (props.cell.color === CONSTANTS.PATHCOLOR) {
        cellBorderRadius = "50%";   
        cellBorder = "1px outset #edc3ae"; 
    }

    if (props.cell.state === CONSTANTS.STARTSTATE || props.cell.state === CONSTANTS.ENDSTATE) {
        cellBorderRadius = "5px";
        cellBorder = "2px outset black";
    } 

    // define css style for cell
    const cellStyle = {
        height: cellHeight,
        width: cellWidth,
        backgroundColor: props.cell.color,
        borderRadius: cellBorderRadius,
        border: cellBorder
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

Cell.propTypes = {
    cell: PropTypes.shape({
        state: PropTypes.oneOf([
            CONSTANTS.STARTSTATE, 
            CONSTANTS.ENDSTATE,
            CONSTANTS.DEFAULTSTATE,
            CONSTANTS.BARRIERSTATE]).isRequired,
        color: PropTypes.string.isRequired
    }).isRequired,
    onMouseDown: PropTypes.func,
    onMouseUp: PropTypes.func,
    onMouseOver: PropTypes.func
};

export default Cell;



