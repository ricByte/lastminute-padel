"use client";

import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {api} from "@/convex/_generated/api";
import "@/app/globals.css";
import Link from "next/link";
import {useAction} from "convex/react";
import {PersistedGame, PersistedPhase} from "@/convex/myFunctions";
import {undefined} from "zod";
import Menu from "@/components/Menu";

type Game = PersistedGame & { nowPlaying: boolean }
export default function Page({ params }: { params: { slug: string } }) {
    const actionRetrieve = useAction(api.myFunctions.getGameForPhase);
    const actionRetrievePhases = useAction(api.myFunctions.getPhasesAction);

    const [gamesForToday, setGamesForToday]: [Game[]|undefined, Dispatch<SetStateAction<Game[]|undefined>>] = useState();
    const [phases, setPhases]: [PersistedPhase[]|undefined, Dispatch<SetStateAction<PersistedPhase[]|undefined>>] = useState();
    const [phase, setPhase]: [PersistedPhase|undefined, Dispatch<SetStateAction<PersistedPhase|undefined>>] = useState();

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
            actionRetrieve({slug: params.slug})
                .then(newVar => {
                    if(newVar && newVar[0].games) {
                        setGamesForToday(addNowPlaying(newVar[0].games))
                        setPhase({
                            _creationTime:newVar[0]._creationTime,
                            _id:newVar[0]._id,
                            day:newVar[0].day,
                            label:newVar[0].label,
                            slug:newVar[0].slug
                        })
                    }
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
            setGamesForToday(addNowPlaying(gamesForToday))
        }, 1000); // Controlla ogni secondo

        return () => clearInterval(interval); // Pulisce l'intervallo quando il componente viene smontato
    }, [gamesForToday]);

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

    return (
        <div className={'partite-container'}>
            <Menu/>
            <div>
                <h1 className={'padel-title'}>Partite  {phase?.label}</h1>
            </div>
            <div className={'partita-grid'}>
                <div>
                    <p className={'phase-item'}>
                        <Link href={`/partite`}>{'Tutte le partite'}</Link>
                    </p>
                    {phases?.map((p, index) => {
                        return (<p key={`phase${index}`} className={'phase-item'}>
                            <Link href={`/partite/giornata/${p.slug}`}>{p.label}</Link>
                        </p>)
                    })}
                </div>
                {gamesForToday?.map((partita, index) => {
                    const startDate = new Date(partita.startDate);
                    return (
                        <div key={index} className={'partita-item'}>
                            <p className={'partita-details'}>
                                {partita.team1} vs {partita.team2} @{startDate.toLocaleString()}
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
}

