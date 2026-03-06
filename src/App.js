import React from 'react'
import NavBar from './Components/NavBar/NavBar'
import './App.css'
import {action, originals, horror, comedy} from "../src/constants/urls"
import Banner from './Components/Banner/Banner'
import RowPost from './Components/RowPost/RowPost'

function App() {
  return (
    <div className="App">
        <NavBar/>
        <Banner/>
        <RowPost title='Netflix Originals' url={originals} />
        <RowPost title='Action' url={action} isSmall />
         <RowPost title='Comedy' url={comedy} isSmall />
        {/* <RowPost title='Romance' url={romance} isSmall /> */}
        <RowPost title='Horror' url={horror} isSmall />
    </div>
  );
}

export default App;
