import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Input from './input';
import { Fragment } from 'react';
import tochki from './assets/img/tochki.png';
import close from './assets/img/close.svg';
import up from './assets/img/up.png';
import down from './assets/img/down.png';

const Cards = () => {

    const [slova, setslova] = useState(null);
    const [russvalue, setrussvalue] = useState('');
    const [englvalue, setengvalue] = useState('');

    const [startNumber, setstartNumber] = useState(0);
    const [endNumber, setendNumber] = useState(10);

    const refInputRuss = useRef();
    const refInputEngl = useRef();

    const halfSlova = slova?.filter((word, index) => index >= startNumber && index < endNumber);

    const UpButton = () => {
        if (startNumber !== 0) {
            setstartNumber(startNumber - 10);
            setendNumber(endNumber - 10);
        }
    }

    const Dounbutton = () => {
        if (slova.length > endNumber) {
            setstartNumber(startNumber + 10);
            setendNumber(endNumber + 10);
        }
    }

    useEffect(() => {
        axios.get(`http://localhost:3001/words`).then((res) => {
            setslova(res.data)
        })
    }, []);

    useEffect(() => {
        if (halfSlova?.length === 0) {
            UpButton()
        }
    }, [[halfSlova?.length]])

    const changes = (id, param) => {
        const changedWords = slova.map(card => { return { ...card } });
        const element = changedWords.findIndex(el => el.id === id);
        changedWords[element][param] = !changedWords[element][param];
        setslova(changedWords)
    }

    const translater = (id) => { changes(id, 'edit') };
    const showmenu = (id) => { changes(id, 'isshow') };
    const showaddmenu = (id) => { changes(id, 'inputisopened') };
    const changeinputisopened = (id) => { changes(id, 'inputisopened') };


    const addWord = (newWordObj) => {
        axios.post(`http://localhost:3001/words`, newWordObj).then(() => {
            const changedWords = [
                newWordObj,
                ...slova,
            ]
            setslova(changedWords)
        })
    };


    const deleteWord = (id) => {
        axios({
            method: 'DELETE',
            params: id,
            url: 'http://localhost:3001/words/' + id,
        }).then(() => {
            const changedWords = slova.filter(card => card.id !== id)
            setslova(changedWords)
        }).catch(() => {
            alert('Не удалось удалить слово');
        });
    }

    const changeWord = (id) => {
        const changedWords = slova.map(card => { return { ...card } })
        const element = changedWords.findIndex(el => el.id === id);
        if (russvalue && englvalue) {
            axios.patch('http://localhost:3001/words/' + id, {
                englishWord: englvalue,
                translateWord: russvalue
            }).then(() => {
                const newSlovo = slova.find(slovo => slovo.id === id)
                newSlovo.englishWord = englvalue;
                newSlovo.translateWord = russvalue;
                const newSlova = slova.filter(slovo => slovo)
                newSlova[element] = newSlovo;
                newSlova[element].isshow = false;
                newSlova[element].inputisopened = false;
                setslova(newSlova);
                setrussvalue('');
                setengvalue('');
            })
        } else {
            alert('ввeдите слово')
        }
    }

    return (
        <Fragment>
            <Input addWord={addWord} />
            <div className="wordsContainer">
                <div className="upDoun">
                    <img onClick={UpButton} src={up} alt="up" />
                </div>
                <div>
                    {halfSlova
                        ?
                        halfSlova.map((word, index) =>
                            <div key={index}>
                                {word.edit
                                    ?
                                    <div className="englishWord2">
                                        <div className="englishWord words" onClick={() => translater(word.id)}>{word.englishWord}</div>
                                    </div>
                                    :
                                    <div>{
                                        !word.inputisopened ?
                                            <div onClick={() => translater(word.id)} className={word.isshow ? "proces words" : "russianWord words"}>{word.translateWord}</div>
                                            :
                                            <div className="inputPlace1">
                                                <div className="inputPlace2">
                                                    <input ref={refInputRuss} placeholder="рус" onChange={() => setrussvalue(refInputRuss.current.value)} value={russvalue} ref={refInputRuss} />
                                                    <input className="rightInput" placeholder="eng" onChange={() => setengvalue(refInputEngl.current.value)} value={englvalue} ref={refInputEngl} />
                                                </div>
                                                <div className="changeDiv">
                                                    <div onClick={() => changeWord(word.id)}>добавить</div>
                                                    <div onClick={() => showaddmenu(word.id)}>закрыть</div>
                                                </div>
                                            </div>}
                                        {!word.isshow
                                            ?
                                            <img onClick={() => showmenu(word.id)} className="tochki" src={tochki} alt="img" />
                                            :
                                            <div className="popap_container">
                                                {!word.inputisopened ?
                                                    <div className="popap">
                                                        <div onClick={() => deleteWord(word.id)} className="deleteChange">удалить</div>
                                                        <div onClick={() => changeinputisopened(word.id)} className="deleteChange">изменить</div>
                                                        <img onClick={() => showmenu(word.id)} src={close} alt="img" />
                                                    </div>
                                                    :
                                                    ''
                                                }
                                            </div>
                                        }
                                    </div>
                                }
                            </div>
                        ) :
                        <span className="pustoePole">пустое поле</span>

                    }
                </div>
                <div className="upDoun">
                    <img onClick={Dounbutton} src={down} alt="down" />
                </div>
            </div>
        </Fragment>
    )
}

export default Cards;