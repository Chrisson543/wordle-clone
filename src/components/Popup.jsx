import React from 'react';
import '../styles/Popup.css';
import restartIcon from '../assets/restart.png';

export default function Popup(props){
    return(
        <div className='backdrop'>
            <div className='popup'>
                <p>Click to restart:</p>
                <img src={restartIcon} onClick={() => props.resetGame()}/>
            </div>
        </div>
    );
};