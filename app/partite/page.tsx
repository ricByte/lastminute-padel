"use client";

import React, {useEffect, useState} from 'react';
import {api} from "@/convex/_generated/api";
import "@/app/globals.css";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {useAction, useMutation} from "convex/react";

const PartitePage: React.FC = () => {
    const [nowPlaying, setNowPlaying] = useState(false);

    useEffect(() => {
        // Controlla l'orario corrente e imposta lo stato di nowPlaying
        const interval = setInterval(() => {
            const now = new Date();

            const isBetween = now >= partite[0].startDate && now <= partite[0].endDate;
            setNowPlaying(isBetween);
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
            startDate: new Date(2024, 2, 8, 8, 0),
            endDate: new Date(2024, 2, 12, 17, 0),
        },
        // Aggiungi altre partite...
    ];

    // const performMyAction = useAction(api.myFunctions.doSomething);
    const performMyAction = useMutation(api.myFunctions.addGames);
    const performMyAction2 = useAction(api.myFunctions.retrieveGames);
    const retrieveGames = () => {
        performMyAction2({date: new Date().toISOString()}).then((r)=>console.log(r))
            .catch(()=>console.log("KO"))
    };
    const addGame = () => {
        performMyAction({
            endDate: "2024-03-10T17:30:00.000Z",
            startDate: "2024-03-12T18:00:00.000Z",
            team1: "Team1",
            team2: "Team2"
        }).then((r)=>console.log(r))
            .catch(()=>console.log("KO"))
    };
    return (
        <div className={'partite-container'}>
            <h1>Partite</h1>
            <Button
                onClick={addGame}
            >
                Add Game
            </Button>
            <Button
                onClick={retrieveGames}
            >
                retrieveGames
            </Button>

            <div className={'partita-grid'}>
                {partite.map((partita, index) => (
                    <div key={index} className={'partita-item'}>
                        <p className={'partita-details'}>
                            {partita.squadra1} vs {partita.squadra2} @{partita.startDate.toLocaleString()}
                        </p>
                        <p className={'partita-details'}>
                            {partita.punteggioSquadra1} - {partita.punteggioSquadra2}
                            {nowPlaying && <span
                                className={'now-playing'}>Now Playing</span>} {/* Didascalia "Now Playing" se nell'orario indicato */}
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
