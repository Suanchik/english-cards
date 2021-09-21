import './App.css';
import React, { useEffect, useState } from 'react';
import close from './assets/img/x.svg'
import axios from 'axios';
import Cards from './components/cards';


const App = () => {

  const [infowindow, stinfowindow] = useState(false);
  const [wordsEnglRus, setwordsEnglRus] = useState(null);
  const [showInfo, setshowInfo] = useState(false);
  const [infoChanges, setinfoChanges] = useState(false);
  const [info, setinfo] = useState('');
  const [wordid, setId] = useState(null);

  const showWordInfo = (info, id, englishWord, translateWord) => {
    setinfoChanges(false);
    setshowInfo(!showInfo);
    stinfowindow(!infowindow);
    setinfo(info);
    setId(id);
    setwordsEnglRus(englishWord + ' - ' + translateWord);
    if (!infowindow) {
      console.log(document.body.classList.add('bodyImg'))
    } else {
      console.log(document.body.classList.remove('bodyImg'))
    }
  }

  return (
    <div className="App">
      <div className={infowindow ? "filter_catds" : null}>
        <Cards showWordInfo={showWordInfo}/>
      </div>
      <div className={infowindow ? "open_window": "hide_window"}>
        <Info 
          setinfoChanges={setinfoChanges}
          wordsEnglRus={wordsEnglRus} 
          showWordInfo={showWordInfo} 
          infoChanges={infoChanges} 
          setinfo={setinfo} 
          info={info} 
          wordid={wordid} 
          info={info} 
          infowindow={infowindow}
        />
      </div>
    </div>
  )
};

const Info = ({ wordsEnglRus, showWordInfo, setinfoChanges, infoChanges, wordid, info, setinfo, infowindow}) => {

  const [sinonimvalue, setsinonimvalue] = useState(info.sinonim);
  const [mnchislovalue, setmnchislovalue] = useState(info.mnchislo);
  const [examplesvalue, setexamplesvalue] = useState(info.examples);
  const [verbvalue, setVerbvalue] = useState(info.past);

  useEffect(() => {
    setsinonimvalue(info.sinonim);
    setmnchislovalue(info.mnchislo);
    setexamplesvalue(info.examples);
    setVerbvalue(info.past);
  }, [info])



  const addChangesToInfo = () => {
    const newInfo = {
      sinonim: sinonimvalue,
      mnchislo: mnchislovalue,
      past: verbvalue,
      examples: examplesvalue,
    }
    axios.patch(`http://localhost:3001/words/` + wordid, {info: newInfo}).then(() => {
            setinfo(newInfo);
            setinfoChanges(!infoChanges);
        })
    }

  return (
    <div>
      {infowindow ? 
      <div className="infoContainer">
        <img className="closeInfo_of_word" onClick={showWordInfo} src={close} alt="close"/>
        <div className="englword_russword"><i>{wordsEnglRus}</i></div>
        {!infoChanges ? 
          <div className="words_info_block">
            <div className="words_info_keys">
                <div>синонимы:</div>
                <div>мн. число:</div>
                <div>прошедшая форма (PP):</div>
                <div>примеры:</div>
            </div>
            <div className="words_info_values">
                {info.sinonim ? <div>{info.sinonim}</div> : <div className="defaultValue"><i>информация отсутствует</i></div>}
                {info.mnchislo ? <div>{info.mnchislo}</div> : <div className="defaultValue"><i>информация отсутствует</i></div>}
                {info.past ? <div>{info.past}</div> : <div className="defaultValue"><i>информация отсутствует</i></div>}
                {info.examples ? <div>{info.examples}</div> : <div className="defaultValue"><i>информация отсутствует</i></div>}
            </div>
          </div>
          :
          <div className="words_info_block">
            <div className="words_info_keys">
                <div>синонимы:</div>
                <div>мн. число:</div>
                <div>прошедшая форма:</div>
                <div>примеры:</div>
            </div>
            <div>
                <div><textarea onChange={(e) => setsinonimvalue(e.currentTarget.value)} placeholder="синонимы" value={sinonimvalue} cols="39"/></div>
                <div><textarea onChange={(e) => setmnchislovalue(e.currentTarget.value)} placeholder="мн. число" value={mnchislovalue} cols="39"/></div>
                <div><textarea onChange={(e) => setVerbvalue(e.currentTarget.value)}placeholder="прошедшая форма" value={verbvalue} cols="39"/></div>
                <div><textarea onChange={(e) => setexamplesvalue(e.currentTarget.value)}placeholder="примеры" value={examplesvalue} rows="19" cols="39"/></div>
            </div>
          </div>
          }
      {!infoChanges 
      ? 
      <div className="changeInfo" onClick={() => setinfoChanges(!infoChanges)}>внести изменения</div> 
      : 
      <div className="changeInfo" onClick={addChangesToInfo}>добавить изменения</div>
      }
      </div>
      :
      null
      }
    </div>
  )
}

export default App;