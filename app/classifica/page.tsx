"use client";

import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {api} from "@/convex/_generated/api";
import "@/app/globals.css";
import Link from "next/link";
import {useAction} from "convex/react";
import {PersistedGame, PersistedRanking} from "@/convex/myFunctions";
import Menu from "@/components/Menu";

type Game = PersistedGame & { nowPlaying: boolean }
const ClassificaPage: React.FC = () => {
    const actionRetrieveRanking = useAction(api.myFunctions.getRankingAction);

    const [ranking, setRanking]: [PersistedRanking[]|undefined, Dispatch<SetStateAction<PersistedRanking[]|undefined>>] = useState();

    useEffect(() => {
        actionRetrieveRanking().then(r => {
            if(r) setRanking(r)
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
            <table className={'classifica-table'}>
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
                {ranking && ranking.map((squadra, index) => (
                    <tr key={index}>
                        <td>{squadra.ranking}</td>
                        <td><Link target="_self" href={`/partite/team/${generateSlug(squadra.teamName)}`}>{squadra.teamName}</Link></td>
                        <td>{squadra.points}</td>
                        <td>{squadra.games}</td>
                        <td>{squadra.wonGames}</td>
                        <td>{squadra.lostGames}</td>
                        <td>{squadra.gamesTotalPoints}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div style={{marginTop: 20}}>
                <Link href="/">Torna alla home</Link>
            </div>
        </div>
    );
};

export default ClassificaPage;
