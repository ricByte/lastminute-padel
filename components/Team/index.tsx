import React from 'react';
import '../../app/globals.css';

interface TeamProps {
    name: string;
    members: string[];
}

const Index: React.FC<TeamProps> = ({ name, members }) => {
    return (
        <div className={'team-container'}>
            <h2 className={'team-name'}>{name}</h2>
            <ul className={'player-list'}>
                {members.map((player, index) => (
                    <li className={'player-item'} key={index}>{player}</li>
                ))}
            </ul>
        </div>
    );
};

export default Index;