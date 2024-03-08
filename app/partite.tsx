// pages/partite.tsx

import React from 'react';
import "./globals.css";

const PartitePage: React.FC = () => {
    const partite = [
        {
            squadra1: 'Team A',
            squadra2: 'Team B',
            punteggioSquadra1: 2,
            punteggioSquadra2: 1,
        },
        // Aggiungi altre partite...
    ];

    return (
        <div className={'partite-container'}>
            <h1>Partite</h1>
            {partite.map((partita, index) => (
                <div key={index} className={'partita-item'}>
                    <p className={'partita-details'}>
                        {partita.squadra1} vs {partita.squadra2}: {partita.punteggioSquadra1} - {partita.punteggioSquadra2}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default PartitePage;
