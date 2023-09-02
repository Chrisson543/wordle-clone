import React from 'react';
import '../styles/Notification.css';

export default function ErrorBox(props){
    return(
        <div className='error-box'>
            <p className='error-message'>{props.message}</p>
        </div>
    );
};