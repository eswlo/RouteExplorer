import React from "react"
import Grid from "./Grid"

// a function that handle main body
export default function Main(props) {
    return (
        <main>
            <Grid radioState={props.radioState}/>
        </main>
    )
}