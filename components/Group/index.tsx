import React from 'react';
import Team from '@/components/Team';
import '../../app/globals.css';

interface GroupProps {
    teams: { name: string; members: string[] }[];
    name: string;
}

const Group: React.FC<GroupProps> = ({ teams, name }) => {
    return (
        <div className={'group-container'}>
            <h2 className={'group-name'}>{name}</h2>
            <div className={'teams-list'}>
                {teams.map((team, index) => (
                    <Team key={index} {...team} />
                ))}
            </div>
        </div>
    );
};

export default Group;