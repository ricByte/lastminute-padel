"use client";

import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {api} from "@/convex/_generated/api";
import "@/app/globals.css";
import Link from "next/link";
import {useAction} from "convex/react";
import {PersistedGame} from "@/convex/myFunctions";
import {EitherTag} from "@/lib/Either";
import Menu from "@/components/Menu";

type Game = PersistedGame & { nowPlaying: boolean }
const PartitePage: React.FC = () => {
    const actionRetrieve = useAction(api.myFunctions.retrieveGames);

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
        const effect = async () => {
            const newVar = await actionRetrieve({});
            if(newVar) setGamesForToday(addNowPlaying(newVar))
        };
        effect()
            .then(()=>console.log("DONE"))
            .catch(()=>console.log("ERROR"))

    }, []);

    useEffect(() => {
        // Controlla l'orario corrente e imposta lo stato di nowPlaying
        const interval = setInterval(() => {
            setGamesForToday(addNowPlaying(gamesForToday))
        }, 1000); // Controlla ogni secondo

        return () => clearInterval(interval); // Pulisce l'intervallo quando il componente viene smontato
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
                     switch (r.is()) {
                         case EitherTag.LEFT:
                             console.log('error', r.value)
                             break;
                         case EitherTag.RIGHT: {
                             actionRetrieve({})
                                 .then((newVar) => {
                                     if (newVar) setGamesForToday(addNowPlaying(newVar))
                                 })
                                 .catch((e) => {
                                     console.log('error', e)
                                 })
                             break;
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
            <Menu/>
            <div>
                <h1 className={'padel-title'}>Aggiorna partite</h1>
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
                                {partita.nowPlaying && <span
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
