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
            <div className={'padel-intro'}>
                <h1 className={'padel-title'}>Welcome to the Padel Page!</h1>
                <p className={'padel-text'}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce malesuada fringilla justo, id
                    vestibulum neque facilisis ut.
                    Nullam nec est non nisi dictum scelerisque. Sed vitae sem id libero sollicitudin dignissim.
                </p>
            </div>
            <div>
                {groups.map((group, index) => (
                    <Group key={index} {...group} />
                ))}
            </div>
        </div>
    );
};

export default PadelPage;