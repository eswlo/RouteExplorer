// import React from "react"
import PropTypes from 'prop-types';


// a function that handle navbar
export default function Navbar(props) {
    return (
        <nav>
            <h1 className="nav-title">Route Explorer</h1>
            <h3 className="nav-text">A* search algorithm</h3>
            <fieldset className="nav-radio-field">
                <input 
                    type="radio"
                    id="setStart"
                    name="setState"
                    value="setStart"
                    onChange={() => props.handleRadioChange("setStart")}
                    defaultChecked 
                />
                <label className="nav-radio-label" htmlFor="setStart">Set start cell</label>
                <br />
                
                <input 
                    type="radio"
                    id="setEnd"
                    name="setState"
                    value="setEnd"
                    onChange={() => props.handleRadioChange("setEnd")}
                />
                <label className="nav-radio-label" htmlFor="setEnd">Set end cell</label>
                <br />
                
                <input 
                    type="radio"
                    id="setBarriers"
                    name="setState"
                    value="setBarriers"
                    onChange={() => props.handleRadioChange("setBarriers")}
                />
                <label className="nav-radio-label" htmlFor="setBarriers">Draw barrier(s)</label>
                <br />
        
            </fieldset>
            <button className="nav-explore-btn"
                    onClick={props.handleExplore}
            >Explore</button>
        </nav>
    )
}

Navbar.propTypes = {
    handleRadioChange: PropTypes.func.isRequired, // Validate that it is a function
    handleExplore: PropTypes.func.isRequired
};