import React, {useEffect, useState} from 'react';
import '../../app/globals.css';
import {FaTrophy} from "react-icons/fa6";
import { ReactConfetti as Confetti } from "react-confetti";

interface WinnerProps {

}

export const Winner: React.FC<WinnerProps> = () => {
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        setShowConfetti(true);
        setTimeout(() => {
            setShowConfetti(false);
        }, 3000);
    }, []);

    return (
        <div className={'vincitore-container'}>
            {showConfetti && <Confetti />}
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