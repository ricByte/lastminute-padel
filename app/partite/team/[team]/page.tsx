"use client";

import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {api} from "@/convex/_generated/api";
import "@/app/globals.css";
import Link from "next/link";
import {useAction} from "convex/react";
import {PersistedGame, PersistedGroup} from "@/convex/myFunctions";
import Menu from "@/components/Menu";

type Game = PersistedGame & { nowPlaying: boolean }
export default function Page({ params }: { params: { team: string } }) {
    const actionRetrieve = useAction(api.myFunctions.getGameForTeam);
    const actionRetrieveGroups = useAction(api.myFunctions.retrieveGroups);

    const [groups, setGroups]: [PersistedGroup[]|undefined, Dispatch<SetStateAction<PersistedGroup[]|undefined>>] = useState();
    const [gamesForToday, setGamesForToday]: [Game[]|undefined, Dispatch<SetStateAction<Game[]|undefined>>] = useState();

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
            actionRetrieve({team: `Team ${params.team.substring(4)}`})
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
            actionRetrieveGroups()
                .then(r => {
                    if(r) setGroups(r)
                })
                .catch(reason => console.log(reason))
        };
        callback();
    }, [params.team]);

    useEffect(() => {
        // Controlla l'orario corrente e imposta lo stato di nowPlaying
        const interval = setInterval(() => {
            setGamesForToday(addNowPlaying(gamesForToday))
        }, 1000); // Controlla ogni secondo

        return () => clearInterval(interval); // Pulisce l'intervallo quando il componente viene smontato
    }, [gamesForToday]);

    const groupInfo = function (team: string): { name: string; members: string[]; id?: string } {
        return groups && groups.flatMap((g) => {
                return g.teams.find(
                    (t) => {
                        return t.name === team;
                    })
            }
        ).find((f)=>!!f) || {name:"No members", members:[], id: ""};
    }
    return (
        <div className={'partite-container'}>
            <Menu/>
            <div>
                <h1 className={'padel-title'}>  {`Partite Team ${params.team.substring(4)}`}</h1>
                <h4>{groupInfo(`Team ${params.team.substring(4)}`)?.members.join("-")}</h4>
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

