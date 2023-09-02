import React from "react";
import backspaceIcon from '../assets/backspace.png';

export default function Key(props){
    function keyPress(){
        switch (props.letter.toUpperCase()){
            case 'BACKSPACE':
                return props.backspace();
            case 'ENTER':
                return props.onEnter(props.letter);
            default: 
                return props.keyPress(props.letter);
        };
    };
    
    return(
        <button className={`keyboard-button ${props.letter.toUpperCase() == 'ENTER' && 'enter-button'} ${props.className}`} onClick={() => keyPress()}>
           {props.letter.toUpperCase() === 'BACKSPACE' ? <img className="backspace-icon" src={backspaceIcon} /> : props.letter.toUpperCase()}
        </button>
    );
    
};