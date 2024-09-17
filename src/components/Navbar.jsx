// import React from "react"
import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';


// a function that handle navbar
export default function Navbar(props) {
    // console.log(props.startCell);




    const getWarningMessage = useCallback(() => {
        if (!props.startCell && !props.endCell) {
          return "Please set both start and end cells";
        }
        if (!props.startCell && props.endCell) {
          return "Please set the start cell";
        }
        if (props.startCell && !props.endCell) {
          return "Please set the end cell";
        }
        return "Feel free to draw some barriers!"; // No message if all conditions are satisfied
      }, [props.startCell, props.endCell]);

      const warningMessage = getWarningMessage();

    return (
        <nav>
            <h1 className="nav-title">Route Explorer</h1>
            {/* <h3 className="nav-text">A* search algorithm</h3> */}
            <div className='nav-dropdown'>
                <label htmlFor="algos" className='nav-dropdown-label'>Pick one search algorithm:</label>
                <select disabled={props.isTerminated || props.exploreClicked}
                    id="algos"
                    value={props.selectedAlgo}
                    onChange={() => props.handleSelectedAlgo(event.target.value)}
                    name="algos">
                    <option value="aStar">A*</option>
                    <option value="standardDFS">standard DFS</option>
                    <option value="randomizedDFS">randomized DFS</option>
                    <option value="standardBFS">standard BFS</option>
                    <option value="randomizedBFS">randomized BFS</option>
                </select>
            </div>
  
            <fieldset className="nav-radio-field">
                <input 
                    type="radio"
                    id="setStart"
                    name="setState"
                    value="setStart"
                    checked={props.radioSelectedOption === 'setStart'}
                    onChange={() => props.handleRadioChange("setStart")}
                />
                <label className="nav-radio-label" htmlFor="setStart">Set start cell</label>
                <br />
                
                <input 
                    type="radio"
                    id="setEnd"
                    name="setState"
                    value="setEnd"
                    checked={props.radioSelectedOption === 'setEnd'}
                    onChange={() => props.handleRadioChange("setEnd")}
                />
                <label className="nav-radio-label" htmlFor="setEnd">Set end cell</label>
                <br />
                
                <input 
                    type="radio"
                    id="setBarriers"
                    name="setState"
                    value="setBarriers"
                    checked={props.radioSelectedOption === 'setBarriers'}
                    onChange={() => props.handleRadioChange("setBarriers")}
                />
                <label className="nav-radio-label" htmlFor="setBarriers">Draw barrier(s)</label>
                <br />
        
            </fieldset>
            <div className='btn-warning-container'>
                <div className="btn-container">
                    <button className="nav-btn"
                        onClick={props.handleExplore}
                    >Explore</button>
                    <button className="nav-btn"
                        onClick={props.handleTerminate}
                        disabled={!props.startCell || !props.endCell || !props.exploreClicked}
                    >Terminate</button>
                    <button className="nav-btn"
                        onClick={props.handleReset}
                        disabled={!props.isTerminated}
                    >Reset</button>
                </div>
                {warningMessage && <p className='nav-warning'>{warningMessage}</p>}
            </div>
        </nav>
    )
}

Navbar.propTypes = {
    handleRadioChange: PropTypes.func.isRequired, // Validate that it is a function
    handleExplore: PropTypes.func.isRequired,
    handleTerminate: PropTypes.func.isRequired,
    radioSelectedOption: PropTypes.string.isRequired,
};