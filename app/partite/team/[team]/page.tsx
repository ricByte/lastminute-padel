"use client";

import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {api} from "@/convex/_generated/api";
import "@/app/globals.css";
import Link from "next/link";
import {useAction} from "convex/react";
import {PersistedGame} from "@/convex/myFunctions";

export default function Page({ params }: { params: { team: string } }) {
    const actionRetrieve = useAction(api.myFunctions.getGameForTeam);

    const [nowPlaying, setNowPlaying] = useState(false);
    const [gamesForToday, setGamesForToday]: [PersistedGame[]|undefined, Dispatch<SetStateAction<PersistedGame[]|undefined>>] = useState();

    useEffect(()=> {
        const callback = () => {
            actionRetrieve({team: params.team.substring(4)})
                .then(newVar => {
                    if(newVar) setGamesForToday(newVar)
                })
                .catch(reason => console.log(reason))
        };
        const interval = setInterval( callback, 60*1000); // Controlla ogni minuto
        callback();
        return () => clearInterval(interval); // Pulisce l'intervallo quando il componente viene smontato
    }, []);

    useEffect(() => {
        // Controlla l'orario corrente e imposta lo stato di nowPlaying
        const interval = setInterval(() => {
            const now = new Date().toISOString();

            const isBetween = !!gamesForToday && now >= gamesForToday[0].startDate && now <= gamesForToday[0].endDate;
            setNowPlaying(isBetween);
        }, 1000); // Controlla ogni secondo

        return () => clearInterval(interval); // Pulisce l'intervallo quando il componente viene smontato
    }, []);

    useEffect(() => {

    }, [gamesForToday]);

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

    return (
        <div className={'partite-container'}>
            <div className={'padel-intro'}>
                <h1 className={'padel-title'}>Partite di oggi</h1>
            </div>
            <div className={'partita-grid'}>
                {gamesForToday?.map((partita, index) => {
                    const startDate = new Date(partita.startDate);
                    return (
                        <div key={index} className={'partita-item'}>
                            <p className={'partita-details'}>
                                {partita.team1} vs {partita.team2} @{startDate.toLocaleString()}
                            </p>
                            <p className={'partita-details'}>
                                {partita.pointsTeam1} - {partita.pointsTeam2}
                                {nowPlaying && <span
                                    className={'now-playing'}>Now Playing</span>} {/* Didascalia "Now Playing" se nell'orario indicato */}
                            </p>
                            <p>Vincitore: {partita.winner}</p> {/* Mostra il vincitore */}
                        </div>
                    );
                })}
            </div>
            <Link href="/">Torna alla home</Link>
        </div>
    );
}

