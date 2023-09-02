import React from 'react';
import '../styles/OrientationErrorPopup.css'

export default function OrientationErrorPopup(){
    return(
        <div className='orientation-error-popup'>
            <h1>Can't play game in this orientation! <br/> Please rotate your phone!</h1>
        </div>
    );
};