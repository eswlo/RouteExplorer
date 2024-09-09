import React from "react"

// a function that handle navbar
export default function Navbar() {
    return (
        <nav>
            <h1 className="nav-title">Route Explorer</h1>
            <h3 className="nav-text">Dijkstra's algorithm</h3>
            <fieldset className="nav-radio-field">
                <input 
                    type="radio"
                    id="setStart"
                    name="setState"
                    value="setStart"
                    // onChange={handle}
                />
                <label className="nav-radio-label" htmlFor="setStart">Set Start (by clicking a cell)</label>
                <br />
                
                <input 
                    type="radio"
                    id="setEnd"
                    name="setState"
                    value="setEnd"
                    // onChange={handle}
                />
                <label className="nav-radio-label" htmlFor="setEnd">Set End (by clicking a cell)</label>
                <br />
                
                <input 
                    type="radio"
                    id="setBarriers"
                    name="setState"
                    value="setBarriers"
                    // onChange={handle}
                />
                <label className="nav-radio-label" htmlFor="setBarriers">Set Barriers (by hovering over cells)</label>
                <br />
        
            </fieldset>
            <button className="nav-explore-btn">Explore</button>
        </nav>
    )
}