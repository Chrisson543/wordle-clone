import React from "react";
import '../styles/LetterBox.css';

export default function LetterBox(props){
    return(
        <div className={`letter-box ${props.className}`}>
            <p>{props.letter.toUpperCase()}</p>
        </div>
    )
};