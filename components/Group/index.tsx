import React from 'react';
import Team from '@/components/Team';
import '../../app/globals.css';

interface GroupProps {
    teams: { name: string; players: string[]; ranking: string }[];
    groupName: string;
}

const Group: React.FC<GroupProps> = ({ teams, groupName }) => {
    return (
        <div className={'group-container'}>
            <h2>{groupName}</h2>
            <div className={'teams-list'}>
                {teams.map((team, index) => (
                    <Team key={index} {...team} />
                ))}
            </div>
        </div>
    );
};

export default Group;