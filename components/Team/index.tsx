import React from 'react';
import '../../app/globals.css';
import Link from "next/link";

interface TeamProps {
    name: string;
    id?: string;
    members: string[];
}

const Index: React.FC<TeamProps> = ({ name, members, id }) => {
    return (
        <div className={'team-container'}>
            <h2 className={'team-name'}>
                <Link target="_self" href={`/partite/team/${id}`}>{name}</Link>
            </h2>
            <ul className={'player-list'}>
                {members.map((player, index) => (
                    <li className={'player-item'} key={index}>{player}</li>
                ))}
            </ul>
        </div>
    );
};

export default Index;