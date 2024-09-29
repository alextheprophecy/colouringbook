// Background.component.jsx
import React from 'react';
import '../../Styles/UI/background.css';

const Background = ({ children }) => (
    <div className="background">
        <div className="background-middle">
            <div className="background-top"></div>
            <div className="background-bottom"></div>
            <div className="content-over-background">
                {children}
            </div>
        </div>

    </div>
);

export default Background;
