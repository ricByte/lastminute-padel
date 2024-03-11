"use client";

import './globals.css';
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import Group from "@/components/Group";
import Menu from "@/components/Menu";
import {useAction} from "convex/react";
import {api} from "@/convex/_generated/api";
import {PersistedGroup} from "@/convex/myFunctions";


const PadelPage: React.FC = () => {
    const actionRetrieve = useAction(api.myFunctions.retrieveGroups);
    const [groups, setGroups]: [PersistedGroup[]|undefined, Dispatch<SetStateAction<PersistedGroup[]|undefined>>] = useState();

    useEffect(()=> {
        const effect = async () => {
            const newVar = await actionRetrieve();
            if(newVar) setGroups(newVar)
        };
        effect()
            .then(()=>console.log("DONE"))
            .catch(()=>console.log("ERROR"))

    }, []);

    return (
        <div className={'padel-container'}>
            <Menu/>
            <div className={'padel-intro'}>
                <h1 className={'padel-title'}>Benvenuti al sito ufficiale del torneo di padel lastminute 2024 !</h1>
                <p className={'padel-text'}>
                    Qui potrete trovare i team con i relativi gironi
                </p>
            </div>
            <div>
                {groups?.map((group, index) => (
                    <Group key={index} {...group} />
                ))}
            </div>
        </div>
    );
};

export default PadelPage;