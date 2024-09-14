import { useState } from 'react'
import Navbar from './components/Navbar'
import Main from './components/Main'

export default function App() {

  const [canExplore, setCanExplore] = useState(false);
  const [radioState, setRadioState] = useState("setStart")

  function handleExplore() {
    // console.log("handleExplore");
    setCanExplore(true);
  }

  function handleRadioChange(newRadioState) {
    // console.log(newRadioState);
    setRadioState(newRadioState);
  }

  return (
    <div>
          <Navbar 
            handleRadioChange={handleRadioChange}
            handleExplore={handleExplore}
            />
          <Main 
            radioState={radioState}
            canExplore={canExplore}
          />
    </div>
  )
}

