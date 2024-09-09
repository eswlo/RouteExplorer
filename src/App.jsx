import { useState } from 'react'
import Navbar from './components/Navbar'
import Main from './components/Main'

export default function App() {

  const [isExploring, setIsExplore] = useState(false);
  const [radioState, setRadioState] = useState("setStart")

  function handleRadioChange(newRadioState) {
    console.log(newRadioState);
    setRadioState(newRadioState);
  }

  return (
    <div>
          <Navbar handleRadioChange={handleRadioChange}/>
          <Main />
    </div>
  )
}

