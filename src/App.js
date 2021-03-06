import './App.css';
import React, { useEffect, useState } from 'react';
import close from './assets/img/x.svg'
import axios from 'axios';
import Cards from './components/cards';
import img from './assets/img/englishImg.jpg'


const App = () => {

  const [infowindow, stinfowindow] = useState(false);
  const [wordsEnglRus, setwordsEnglRus] = useState(null);
  const [showInfo, setshowInfo] = useState(false);
  const [infoChanges, setinfoChanges] = useState(false);
  const [info, setinfo] = useState('');
  const [wordid, setId] = useState(null);
  const [photo, setphoto] = useState(null);

  const showWordInfo = (info, id, englishWord, translateWord, photo) => {
    setinfoChanges(false);
    setshowInfo(!showInfo);
    stinfowindow(!infowindow);
    setinfo(info);
    setId(id);
    setphoto(photo);
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
          photo={photo}
          setphoto={setphoto}
        />
      </div>
    </div>
  )
};

const Info = ({ wordsEnglRus, showWordInfo, setinfoChanges, infoChanges, wordid, info, setinfo, infowindow, setphoto, photo}) => {

  const [sinonimvalue, setsinonimvalue] = useState(info.sinonim);
  const [mnchislovalue, setmnchislovalue] = useState(info.mnchislo);
  const [examplesvalue, setexamplesvalue] = useState(info.examples);
  const [verbvalue, setVerbvalue] = useState(info.past);

  useEffect(() => {
    setsinonimvalue(info.sinonim);
    setmnchislovalue(info.mnchislo);
    setexamplesvalue(info.examples);
    setVerbvalue(info.past);
    setphoto(photo)
  }, [info])



  const addChangesToInfo = () => {
    const newInfo = {
      sinonim: sinonimvalue,
      mnchislo: mnchislovalue,
      past: verbvalue,
      examples: examplesvalue,
    }
    axios.patch(`/words/` + wordid, {info: newInfo}).then(() => {
            setinfo(newInfo);
            setinfoChanges(!infoChanges);
        })
    }

    // const addPhoto = (e) => {
    //   const reader = new FileReader();
    //   reader.onload = () => {
    //     setphoto(reader.result)
    //     // const wordPhoto = reader.result
    //     // axios.patch(`/words/` + wordid, {photo: wordPhoto})
    //   }
    //   reader.readAsDataURL(e.target.files[0])
    // }

  return (
    <div>
      {infowindow ? 
      <div className="infoContainer">
        <img className="closeInfo_of_word" onClick={showWordInfo} src={close} alt="close"/>
        <div className="englword_russword"><i>{wordsEnglRus}</i></div>
        {!infoChanges ? 
          <div className="words_info_block">
            <div className="words_info_keys">
                <div>????????????????:</div>
                <div>????. ??????????:</div>
                <div>?????????????????? ?????????? (PP):</div>
                <div>??????????????:</div>
            </div>
            <div className="words_info_values">
                {info.sinonim ? <div>{info.sinonim}</div> : <div className="defaultValue"><i>???????????????????? ??????????????????????</i></div>}
                {info.mnchislo ? <div>{info.mnchislo}</div> : <div className="defaultValue"><i>???????????????????? ??????????????????????</i></div>}
                {info.past ? <div>{info.past}</div> : <div className="defaultValue"><i>???????????????????? ??????????????????????</i></div>}
                {info.examples ? <div>{info.examples}</div> : <div className="defaultValue"><i>???????????????????? ??????????????????????</i></div>}
                <div className="photo_block">
              {/* <input type="file" id="imgfile" onChange={(e) => addPhoto(e)} className="input" />
              <label className="addPhoto" for="imgfile">???????????????? ????????????????</label> */}
            </div>
            </div>
              {/* <img src={photo ? photo: img} className="word_photo" alt="word_photo" className="wordPhoto"/> */}
          </div>
          :
          <div className="words_info_block">
            <div className="words_info_keys">
                <div>????????????????:</div>
                <div>????. ??????????:</div>
                <div>?????????????????? ??????????:</div>
                <div>??????????????:</div>
            </div>
            <div>
                <div><textarea onChange={(e) => setsinonimvalue(e.currentTarget.value)} placeholder="????????????????" value={sinonimvalue} cols="39"/></div>
                <div><textarea onChange={(e) => setmnchislovalue(e.currentTarget.value)} placeholder="????. ??????????" value={mnchislovalue} cols="39"/></div>
                <div><textarea onChange={(e) => setVerbvalue(e.currentTarget.value)}placeholder="?????????????????? ??????????" value={verbvalue} cols="39"/></div>
                <div><textarea onChange={(e) => setexamplesvalue(e.currentTarget.value)}placeholder="??????????????" value={examplesvalue} rows="19" cols="39"/></div>
            </div>
          </div>
          }
      {!infoChanges 
      ? 
      <div className="changeInfo" onClick={() => setinfoChanges(!infoChanges)}>???????????? ??????????????????</div> 
      : 
      <div className="changeInfo" onClick={addChangesToInfo}>???????????????? ??????????????????</div>
      }
      </div>
      :
      null
      }
    </div>
  )
}

export default App;