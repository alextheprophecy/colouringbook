// Background.component.jsx
import React from 'react';
import '../../Styles/UI/background.css';

const Background = ({ children }) => (
    <div className="background">
        <div className="background-middle">
            <div className="background-top"></div>
            {children}
        </div>

    </div>
);

export default Background;
