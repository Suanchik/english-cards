import React, { useRef, useState } from 'react';
import './input.css';

function Input({ addWord }) {

    const [russvalue, setrussvalue] = useState('');
    const [englvalue, setengvalue] = useState('')

    const rusRef = useRef();
    const engRef = useRef();

    const addNewWord = () => {
        if (russvalue && englvalue) {
            const newObject = {
                englishWord: englvalue,
                translateWord: russvalue,
                edit: false,
                id: Math.random() * 5,
                isshow: false,
                inputisopened: false,
                info: {
                    past: "",
                    sinonim: null,
                    mnchislo: null,
                    examples: "",
                    photo: null
                }
            }
            addWord(newObject);
            setrussvalue('');
            setengvalue('');
        } else {
            alert('введите слово')
        }
    }

    return (
        <div>
            <div className="inputPlace">
                <div className="russianInput"><div>рус</div><input ref={rusRef} onChange={() => setrussvalue(rusRef.current.value)} value={russvalue} /></div>
                <div className="englishInput"><div>eng</div><input ref={engRef} onChange={() => setengvalue(engRef.current.value)} value={englvalue} /></div>
            </div>
            <div className="add_word" onClick={addNewWord}>ДОБАВИТЬ СЛОВО</div>
        </div>
    )
}

export default Input

