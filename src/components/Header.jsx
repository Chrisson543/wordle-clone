import React from 'react';
import '../styles/header.css';
import hamburgerMenu from '../assets/hamburger-menu.png';

export default function Header(props){
    return(
        <div className='header'>
            <img className='hamburger-menu' src={hamburgerMenu} onClick={() => props.hamburgerMenuClick()}/>
            <h1>Wordle Clone by Chrisson</h1>
        </div>
    );
};