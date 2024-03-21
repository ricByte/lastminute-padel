"use client";

import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {api} from "@/convex/_generated/api";
import "@/app/globals.css";
import Link from "next/link";
import {useAction} from "convex/react";
import {PersistedRankingGroup} from "@/convex/myFunctions";
import Menu from "@/components/Menu";

const ClassificaPage: React.FC = () => {
    const actionRetrieveRanking = useAction(api.myFunctions.getRankingForGroupsAction);

    const [ranking, setRanking]: [PersistedRankingGroup[]|undefined, Dispatch<SetStateAction<PersistedRankingGroup[]|undefined>>] = useState();

    useEffect(() => {
        actionRetrieveRanking().then(r => {
            if(r!=undefined) {
                setRanking(r)
            }
        }).catch((e)=>console.error(e))

    }, []);

    function generateSlug(teamName: string): string {
        return `team${teamName.substring(5)}`
    }

    return (
        <div className={'partite-container'}>
            <Menu/>
            <div>
                <h1 className={'padel-title'}>Classifica generale</h1>
            </div>
            {ranking && ranking.map((squadra, index) => (
                <table className={'classifica-table'} key={`gironisquadra${index}`}>
                    <thead>
                    <tr>
                        <th>Posizione</th>
                        <th>Squadra</th>
                        <th>Punti</th>
                        <th>Partite giocate</th>
                        <th>Partite vinte</th>
                        <th>Partite perse</th>
                        <th>Punteggio totale(in tutte le partite)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {squadra.ranking && squadra.ranking.map((team, index) => (
                        <tr key={index}>
                            <td>{team.ranking}</td>
                            <td><Link target="_self"
                                      href={`/partite/team/${generateSlug(team.teamName)}`}>{team.teamName}</Link>
                            </td>
                            <td>{team.points}</td>
                            <td>{team.games}</td>
                            <td>{team.wonGames}</td>
                            <td>{team.lostGames}</td>
                            <td>{team.gamesTotalPoints}</td>
                        </tr>
                    ))}

                    </tbody>
                </table>
            ))}
            <div style={{marginTop: 20}}>
                <Link href="/">Torna alla home</Link>
            </div>
        </div>
    );
};

export default ClassificaPage;
