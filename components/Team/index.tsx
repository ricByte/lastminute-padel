import React from 'react';
import '../../app/globals.css';

interface TeamProps {
    name: string;
    players: string[];
    ranking: string;
}

const Index: React.FC<TeamProps> = ({ name, players, ranking }) => {
    return (
        <div className={'team-container'}>
            <h2 className={'team-name'}>{name}</h2>
            <p>Ranking: {ranking}</p>
            <ul className={'player-list'}>
                {players.map((player, index) => (
                    <li className={'player-item'} key={index}>{player}</li>
                ))}
            </ul>
        </div>
    );
};

export default Index;