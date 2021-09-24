import './cards.css';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Input from './input';
import { Fragment } from 'react';
import tochki from './../assets/img/tochki.png';
import close from './../assets/img/x.svg';
import up from './../assets/img/up.png';
import down from './../assets/img/down.png';
import leftright from './../assets/img/leftright.png';

const Cards = React.memo(({ showWordInfo }) => {

    const [slova, setslova] = useState(null);
    const [russvalue, setrussvalue] = useState('');
    const [englvalue, setengvalue] = useState('');
    const [carrentPage, setcarrentPage] = useState(1);
    const [num, setnumPage] = useState(1);

    const [startNumber, setstartNumber] = useState(0);
    const [endNumber, setendNumber] = useState(10);

    const refInputRuss = useRef();
    const refInputEngl = useRef();

    let slovaCopy = null;
    slovaCopy = slova && slova.length !== 0 ? [...slova].reverse() : null;
    const halfSlova = slovaCopy?.filter((word, index) => index >= startNumber && index < endNumber);

    const UpButton = () => {
        if (startNumber !== 0) {
            setstartNumber(startNumber - 10);
            setendNumber(endNumber - 10);
            setcarrentPage(carrentPage - 1)
        }
    }

    const Dounbutton = () => {
        if (slova.length > endNumber) {
            setstartNumber(startNumber + 10);
            setendNumber(endNumber + 10);
            setcarrentPage(carrentPage + 1)
        }
    }

    useEffect(() => {
        axios.get(`/words`).then((res) => {
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
        axios.post(`/words`, newWordObj).then(() => {
            const changedWords = [
                ...slova,
                newWordObj
            ]
            setslova(changedWords)
        })
    };

    const changeTranslator = () => {
        const newSlova = slova.map(el => {
            el.edit = !el.edit
            return el
        }
        );
        setslova(newSlova);
    }

    const deleteWord = (id) => {
        axios({
            method: 'DELETE',
            params: id,
            url: '/words/' + id,
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
            axios.patch('/words/' + id, {
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
            <div className="list_container">
                <div className="arrows_block">
                    <div className="arrow_up">
                        <img onClick={UpButton} src={up} alt="up" />
                    </div>
                    <div className="pages">{carrentPage}</div>
                    <div className="arrow_up downButton">
                        <img onClick={Dounbutton} src={down} alt="down" />
                    </div>
                    <img className="leftright" onClick={changeTranslator} src={leftright} alt="leftright" />
                </div>
                <div className="words_block">
                    {halfSlova
                        ?
                        halfSlova.map((word, index) =>
                            <div key={index}>
                                {!word.edit
                                    ?
                                    <div className="englishWord_block">
                                        <div title="click me to translate" className="englishWord words" onClick={() => translater(word.id)}>
                                            <span>
                                                {slovaCopy.findIndex((sl) => word.englishWord === sl.englishWord) + 1}
                                            </span>
                                            <div>{word.englishWord}</div></div>
                                        <div onClick={() => showWordInfo(word.info, word.id, word.englishWord, word.translateWord, word.photo)} className="show_info_of_word">inf...</div>
                                    </div>
                                    :
                                    <div>{
                                        !word.inputisopened ?
                                            <div title="нажми что бы перевести" onClick={() => translater(word.id)} className={word.isshow ? "changing_word words" : "russianWord words"}>
                                                <span>
                                                    {slovaCopy.findIndex((sl) => word.translateWord === sl.translateWord) + 1}
                                                </span>
                                                <div>{word.translateWord}</div>
                                            </div>
                                            :
                                            <div className="change_input_place-1">
                                                <div className="change_input_place-2">
                                                    <input ref={refInputRuss} placeholder="рус" onChange={() => setrussvalue(refInputRuss.current.value)} value={russvalue} ref={refInputRuss} />
                                                    <input className="right_change_input" placeholder="eng" onChange={() => setengvalue(refInputEngl.current.value)} value={englvalue} ref={refInputEngl} />
                                                </div>
                                                <div className="changes_block">
                                                    <div onClick={() => changeWord(word.id)}>добавить</div>
                                                    <div onClick={() => showaddmenu(word.id)}>закрыть</div>
                                                </div>
                                            </div>}
                                        {!word.isshow
                                            ?
                                            <img src={tochki} onClick={() => showmenu(word.id)} className="tochki" />
                                            :
                                            <div className="popap_container">
                                                {!word.inputisopened ?
                                                    <div className="popap">
                                                        <div onClick={() => deleteWord(word.id)} className="deleteChange">удалить</div>
                                                        <div onClick={() => changeinputisopened(word.id)} className="deleteChange change">изменить</div>
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
                        <span className="pustoePole">ПРОСТО НЕТ СЛОВ</span>

                    }
                </div>
            </div>
        </Fragment>
    )
})

export default Cards;