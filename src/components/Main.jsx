// import React from "react"
import PropTypes from 'prop-types';
import Grid from "./Grid"

// a function that handle main body
export default function Main(props) {
    return (
        <main>
            <Grid 
                navRadioState={props.navRadioState}
                setNewStateAndColor={props.setNewStateAndColor}
                grid={props.grid}
            />
        </main>
    )
}

Main.propTypes = {
    navRadioState: PropTypes.string.isRequired,
    setNewStateAndColor: PropTypes.func.isRequired,
};