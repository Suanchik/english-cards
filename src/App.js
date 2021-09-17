import './App.css';
import React, { useState } from 'react';
import Cards from './cards';


const App = () => {

  const [window, setwindow] = useState(false);

  const showWindiw = () => {
    console.log(document.body.classList.add('bodyImg'))
    setwindow(true);
  }

  const closeWindiw = () => {
    console.log(document.body.classList.remove('bodyImg'))
    setwindow(false);
  }

  return (
    <div className="App">
      {!window ? <div className="learnwords" onClick={showWindiw}>ИЗУЧИ АНГЛИЙСКИЕ СЛОВА</div>: ''}
      <div className={window ? "window open" : "window"}><Cards /><span className="closeWindiw" onClick={closeWindiw} rsc="" alt="close">СКРЫТЬ ОКНО</span></div>
    </div>
  )
}

export default App;