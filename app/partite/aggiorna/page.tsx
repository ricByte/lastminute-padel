"use client";

import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {api} from "@/convex/_generated/api";
import "@/app/globals.css";
import Link from "next/link";
import {useAction} from "convex/react";
import {Button} from "@/components/ui/button";
import {Id} from "@/convex/_generated/dataModel";
import {PersistedGame} from "@/convex/myFunctions";

const PartitePage: React.FC = () => {
    const actionRetrieve = useAction(api.myFunctions.retrieveGames);
    const [winner, setWinner] = useState<string>('');
    const [pointsTeam1, setPointsTeam1] = useState<number>(0);
    const [pointsTeam2, setPointsTeam2] = useState<number>(0);

    const [nowPlaying, setNowPlaying] = useState(false);
    const [gamesForToday, setGamesForToday]: [PersistedGame[]|undefined, Dispatch<SetStateAction<PersistedGame[]|undefined>>] = useState();

    useEffect(()=> {
        const effect = async () => {
            const newVar = await actionRetrieve({date: 124567});
            if(newVar) setGamesForToday(newVar)
        };
        effect()
            .then(()=>console.log("DONE"))
            .catch(()=>console.log("ERROR"))

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

     const updateGame = useAction(api.myFunctions.updateGame);
     const updateGameOnClick = (a: Id<"games">)=>{
         updateGame({
             id: a,
             winner,
             pointsTeam1,
             pointsTeam2
         })
             .then((r)=>{
                 switch (r.tag) {
                     case "left":
                         return "KO";
                     case "right": {
                         actionRetrieve({date: 124567})
                             .then((newVar)=>{
                                 if(newVar) setGamesForToday(newVar)
                             })
                             .catch((e)=>{console.log('error', e)})
                     }
                 }
             })
             .catch((e)=>{console.log('error', e)})
     }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWinner(event.target.value);
    };
    const handleInputChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPointsTeam1(parseInt(event.target.value));
    };
    const handleInputChange3 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPointsTeam2(parseInt(event.target.value));
    };
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
            <h1>Partite di oggi</h1>
            <div className={'partita-grid'}>
                {gamesForToday?.map((partita, index) => {
                    const startDate = new Date(partita.startDate);
                    return (
                        <div key={index} className={'partita-item'}>
                            <p className={'partita-details'}>
                                {partita.team1} vs {partita.team2} @{startDate.toLocaleString()}
                            </p>
                            <p className={'partita-details'}>
                                <input
                                    type="text"
                                    defaultValue={partita.pointsTeam1}
                                    placeholder="Punti team 1"
                                    value={winner}
                                    onChange={handleInputChange2}
                                    className={'search-input'}
                                /> - <input
                                type="text"
                                defaultValue={partita.pointsTeam2}
                                placeholder="Punti team 2"
                                value={winner}
                                onChange={handleInputChange3}
                                className={'search-input'}
                            />
                                {nowPlaying && <span
                                    className={'now-playing'}>Now Playing</span>} {/* Didascalia "Now Playing" se nell'orario indicato */}
                            </p>
                            <p>Vincitore: <input
                                type="text"
                                placeholder="Winner..."
                                defaultValue={partita.winner}
                                value={winner}
                                onChange={handleInputChange}
                                className={'search-input'}
                            /></p>
                            <Button onClick={() => updateGameOnClick(partita._id)}>Aggiorna</Button>
                        </div>
                    );
                })}
            </div>
            <Link href="/">Torna alla home</Link>
        </div>
    );
};

export default PartitePage;
