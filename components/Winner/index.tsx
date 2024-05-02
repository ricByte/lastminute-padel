import React from 'react';
import '../../app/globals.css';
import FaTrophy from "@/components/FaTrophy";

interface WinnerProps {

}

export const Winner: React.FC<WinnerProps> = () => {

    return (
        <div className={'vincitore-container'}>
            <FaTrophy className={'trophy-icon'} />
            <div className={'vincitore-info'}>
                <h2>Team 20</h2>
                <h3>fabio.zecchini@lastminute.com </h3>
                <h3>gianluca.boriani@lastminute.com</h3>
            </div>
        </div>
    );
};

export default Winner;