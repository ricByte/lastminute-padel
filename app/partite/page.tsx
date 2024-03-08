"use client";

import React, {useEffect, useState} from 'react';
import "@/app/globals.css";
import Link from "next/link";

const PartitePage: React.FC = () => {
    const [nowPlaying, setNowPlaying] = useState(false);

    useEffect(() => {
        // Controlla l'orario corrente e imposta lo stato di nowPlaying
        const interval = setInterval(() => {
            const now = new Date();
            const currentHour = now.getHours();
            // Imposta nowPlaying se l'orario è tra le 8:00 e le 9:00 (ad esempio)
            setNowPlaying(currentHour >= 11 && currentHour < 13);
        }, 1000); // Controlla ogni secondo

        return () => clearInterval(interval); // Pulisce l'intervallo quando il componente viene smontato
    }, []);

    const partite = [
        {
            squadra1: 'Team A',
            squadra2: 'Team B',
            punteggioSquadra1: 2,
            punteggioSquadra2: 1,
            vincitore: 'Team A', // Aggiungi il vincitore della partita
        },
        // Aggiungi altre partite...
    ];

    return (
        <div className={'partite-container'}>
            <h1>Partite</h1>
            <div className={'partita-grid'}>
                {partite.map((partita, index) => (
                    <div key={index} className={'partita-item'}>
                        <p className={'partita-details'}>
                            {partita.squadra1} vs {partita.squadra2}
                        </p>
                        <p className={'partita-details'}>
                            {partita.punteggioSquadra1} - {partita.punteggioSquadra2}
                            {nowPlaying && <span className={'now-playing'}>Now Playing</span>} {/* Didascalia "Now Playing" se nell'orario indicato */}
                        </p>
                        <p>Vincitore: {partita.vincitore}</p> {/* Mostra il vincitore */}
                    </div>
                ))}
            </div>
            <Link href="/">Torna alla home</Link>
        </div>
    );
};

export default PartitePage;
