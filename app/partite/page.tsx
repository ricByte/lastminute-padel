"use client";

import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {api} from "@/convex/_generated/api";
import "@/app/globals.css";
import Link from "next/link";
import {useAction} from "convex/react";
import {PersistedGame, PersistedPhase} from "@/convex/myFunctions";
import Menu from "@/components/Menu";

type Game = PersistedGame & { nowPlaying: boolean }
const PartitePage: React.FC = () => {
    const actionRetrieve = useAction(api.myFunctions.retrieveGames);
    const actionRetrievePhases = useAction(api.myFunctions.getPhasesAction);

    const [gamesForToday, setGamesForToday]: [Game[]|undefined, Dispatch<SetStateAction<Game[]|undefined>>] = useState();
    const [phases, setPhases]: [PersistedPhase[]|undefined, Dispatch<SetStateAction<PersistedPhase[]|undefined>>] = useState();

    function addNowPlaying(persistedGames: PersistedGame[]|undefined|Game[]): Game[]|undefined {
        const now = new Date().toISOString();
        return persistedGames?.map(game => {
            const isBetween = now >= game.startDate && now <= game.endDate;
            return {
                ...game,
                nowPlaying: isBetween
            }
        });
    }

    useEffect(()=> {
        const callback = () => {
            actionRetrieve({})
                .then(newVar => {
                    if(newVar) setGamesForToday(addNowPlaying(newVar))
                })
                .catch(reason => console.log(reason))
        };
        const interval = setInterval( callback, 60*1000); // Controlla ogni minuto
        callback();
        return () => clearInterval(interval); // Pulisce l'intervallo quando il componente viene smontato
    }, []);

    useEffect(()=> {
        const callback = () => {
            actionRetrievePhases({})
                .then(phases => {
                    if(phases) setPhases(phases)
                })
                .catch(reason => console.log(reason))
        };
        callback();
    }, []);

    useEffect(() => {
        // Controlla l'orario corrente e imposta lo stato di nowPlaying
        const interval = setInterval(() => {
            setGamesForToday(addNowPlaying(gamesForToday))
        }, 1000); // Controlla ogni secondo

        return () => clearInterval(interval); // Pulisce l'intervallo quando il componente viene smontato
    }, [gamesForToday]);

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
            <Menu/>
            <div>
                <h1 className={'padel-title'}>Tutte le partite</h1>
            </div>
            <div>
                {phases?.map((p, index)=>{
                    return (<p key={`phase${index}`} className={'phase-item'}>
                        <Link href={`/partite/giornata/${p.slug}`}>{p.label}</Link>
                    </p>)
                })}
            </div>
            <div className={'partita-grid'}>
                {gamesForToday?.map((partita, index) => {
                    return (
                        <div key={`game${index}`} className={'partita-item'}>
                            <p className={'partita-details'}>
                                {partita.team1} vs {partita.team2} @{new Date(partita.startDate).toLocaleString()}
                            </p>
                            <p className={'partita-details'}>
                                {partita.pointsTeam1} - {partita.pointsTeam2}
                                {partita.nowPlaying && <span
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
};

export default PartitePage;
