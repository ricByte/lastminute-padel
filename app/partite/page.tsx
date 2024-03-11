"use client";

import React, {useEffect, useState} from 'react';
import {api} from "@/convex/_generated/api";
import "@/app/globals.css";
import Link from "next/link";
import {useQuery} from "convex/react";

const PartitePage: React.FC = () => {
    const [nowPlaying, setNowPlaying] = useState(false);

    useEffect(() => {
        // Controlla l'orario corrente e imposta lo stato di nowPlaying
        const interval = setInterval(() => {
            const now = new Date().toISOString();

            const isBetween = !!gamesForToday && now >= gamesForToday[0].startDate && now <= gamesForToday[0].endDate;
            setNowPlaying(isBetween);
        }, 1000); // Controlla ogni secondo

        return () => clearInterval(interval); // Pulisce l'intervallo quando il componente viene smontato
    }, []);

    // const performMyAction = useMutation(api.myFunctions.addGames);
    // const addGame = () => {
    //     performMyAction({
    //         endDate: "2024-03-10T17:30:00.000Z",
    //         startDate: "2024-03-12T18:00:00.000Z",
    //         team1: "Team1",
    //         team2: "Team2"
    //     }).then((r)=>console.log(r))
    //         .catch(()=>console.log("KO"))
    // };
    // const performMyAction2 = useAction(api.myFunctions.retrieveGames);
    // const retrieveGames = () => {
    //     performMyAction2({date: new Date().toISOString()}).then((r)=>console.log(r))
    //         .catch(()=>console.log("KO"))
    // };

    const gamesForToday = useQuery(api.myFunctions.gamesForDay, {date:new Date().toISOString()})

    return (
        <div className={'partite-container'}>
            <h1>Partite di oggi</h1>
            <div className={'partita-grid'}>
                {gamesForToday && gamesForToday.map((partita, index) => (
                    <div key={index} className={'partita-item'}>
                        <p className={'partita-details'}>
                            {partita.team1} vs {partita.team2} @{partita.startDate.toLocaleString()}
                        </p>
                        <p className={'partita-details'}>
                            {partita.pointsTeam1} - {partita.pointsTeam2}
                            {nowPlaying && <span
                                className={'now-playing'}>Now Playing</span>} {/* Didascalia "Now Playing" se nell'orario indicato */}
                        </p>
                        <p>Vincitore: {partita.winner}</p> {/* Mostra il vincitore */}
                    </div>
                ))}
            </div>
            <Link href="/">Torna alla home</Link>
        </div>
    );
};

export default PartitePage;
