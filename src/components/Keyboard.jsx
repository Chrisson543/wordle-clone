import React from 'react';
import Key from './Key';
import '../styles/Keyboard.css';

export default function Keyboard(props){
    const row1 = props.keysList[0].map(key => {
        return <Key key={key.key} letter={key.key} className={key.status} keyPress={props.keyPress} />
    })
    const row2 = props.keysList[1].map(key => {
        return <Key key={key.key} letter={key.key} className={key.status} keyPress={props.keyPress} />
    })
    const row3 = props.keysList[2].map(key => {
        return <Key key={key.key} letter={key.key} className={key.status} keyPress={props.keyPress} backspace={props.backspace} onEnter={props.onEnter}/>
    })

    return(
        <div className='keyboard'>
            <div className='row row-1'>
                {row1}
            </div>
            <div className='row row-2'>
                {row2}
            </div>
            <div className='row row-3'>
                {row3}
            </div>
        </div>
    );
};