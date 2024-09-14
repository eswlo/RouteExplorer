// import React from "react"
import PropTypes from 'prop-types';
import Grid from "./Grid"

// a function that handle main body
export default function Main(props) {
    return (
        <main>
            <Grid radioState={props.radioState}/>
        </main>
    )
}

Main.propTypes = {
    radioState: PropTypes.string.isRequired,
};