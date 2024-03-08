"use client";

import './globals.css';
import React from 'react';
import Group from "@/components/Group";
import Menu from "@/components/Menu";


const PadelPage: React.FC = () => {
    const groups = [
        {
            groupName: 'Group A',
            teams: [
                { name: 'Team A1', players: ['Player 1', 'Player 2'], ranking: 'Low' },
                { name: 'Team A2', players: ['Player 3', 'Player 4'], ranking: 'Intermediate' },
                // Add more teams for Group A
            ],
        },
        {
            groupName: 'Group B',
            teams: [
                { name: 'Team B1', players: ['Player 5', 'Player 6'], ranking: 'Intermediate' },
                { name: 'Team B2', players: ['Player 7', 'Player 8'], ranking: 'High' },
                { name: 'Team B3', players: ['Player 7', 'Player 8'], ranking: 'High' },
                { name: 'Team B4', players: ['Player 7', 'Player 8'], ranking: 'High' },
                { name: 'Team B5', players: ['Player 7', 'Player 8'], ranking: 'High' },
                // Add more teams for Group B
            ],
        },
        // Add more groups as needed
    ];

    return (
        <div className={'padel-container'}>
            <Menu/>
            <h1>Padel Page</h1>
            <p>Welcome to the Padel page of our website!</p>
            <h2>Groups</h2>
            <div>
                {groups.map((group, index) => (
                    <Group key={index} {...group} />
                ))}
            </div>
        </div>
    );
};

export default PadelPage;