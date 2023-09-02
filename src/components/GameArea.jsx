import React from "react";
import '../styles/GameArea.css';

export default function GameArea(props){

    return(
        <div className="game-area">
            {props.letterboxGrid}
        </div>
    );
};