"use client";

import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {api} from "@/convex/_generated/api";
import "@/app/globals.css";
import Link from "next/link";
import {useAction} from "convex/react";
import {PersistedGame} from "@/convex/myFunctions";

const PartitePage: React.FC = () => {
    const actionRetrieve = useAction(api.myFunctions.retrieveGames);

    const [nowPlaying, setNowPlaying] = useState(false);
    const [gamesForToday, setGamesForToday]: [PersistedGame[]|undefined, Dispatch<SetStateAction<PersistedGame[]|undefined>>] = useState();

    useEffect(()=> {
        const effect = async () => {
            const newVar = await actionRetrieve({date: new Date().getTime()});
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
     const updateGameOnClick = (index: number)=>{
         console.log("onBlur", index);
         if(gamesForToday) {
             const gameToUpdate = gamesForToday[index];
             updateGame({
                 id: gameToUpdate._id,
                 winner: gameToUpdate.winner,
                 pointsTeam1: gameToUpdate.pointsTeam1,
                 pointsTeam2: gameToUpdate.pointsTeam2
             })
                 .then((r) => {
                     switch (r.tag) {
                         case "left":
                             return "KO";
                         case "right": {
                             actionRetrieve({date: 124567})
                                 .then((newVar) => {
                                     if (newVar) setGamesForToday(newVar)
                                 })
                                 .catch((e) => {
                                     console.log('error', e)
                                 })
                         }
                     }
                 })
                 .catch((e) => {
                     console.log('error', e)
                 })
         }
     }

    const handleWinnerInputChange = (index: number)=>(event: React.ChangeEvent<HTMLInputElement>) => {
        if (gamesForToday)
        {
            const persistedGames = [
                ...gamesForToday,
            ];
            persistedGames[index].winner = event.target.value
            setGamesForToday(persistedGames)
        }
    };

    const handlePt1InputChange = (index: number)=>(event: React.ChangeEvent<HTMLInputElement>) => {
        if (gamesForToday)
        {
            const persistedGames = [
                ...gamesForToday,
            ];
            persistedGames[index].pointsTeam1 = parseInt(event.target.value)
            setGamesForToday(persistedGames)
        }
    };

    const handlePt2InputChange = (index: number)=>(event: React.ChangeEvent<HTMLInputElement>) => {
         if (gamesForToday)
        {
            const persistedGames = [
                ...gamesForToday,
            ];
            persistedGames[index].pointsTeam2 = parseInt(event.target.value)
            setGamesForToday(persistedGames)
        }
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
            <div>
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
                                <input
                                    type="text"
                                    value={partita.pointsTeam1}
                                    onChange={handlePt1InputChange(index)}
                                    onBlur={() => updateGameOnClick(index)}
                                    className={'search-input'}
                                /> - <input
                                type="text"
                                value={partita.pointsTeam2}
                                onChange={handlePt2InputChange(index)}
                                onBlur={() => updateGameOnClick(index)}
                                className={'search-input'}
                            />
                                {nowPlaying && <span
                                    className={'now-playing'}>Now Playing</span>} {/* Didascalia "Now Playing" se nell'orario indicato */}
                            </p>
                            <p>Vincitore: <input
                                type="text"
                                value={partita.winner}
                                onChange={handleWinnerInputChange(index)}
                                onBlur={() => updateGameOnClick(index)}
                                className={'search-input'}
                            /></p>
                        </div>
                    );
                })}
            </div>
            <Link href="/">Torna alla home</Link>
        </div>
    );
};

export default PartitePage;
