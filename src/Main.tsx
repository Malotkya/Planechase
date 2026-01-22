/** /src/Main
 * 
 * @author Alex Malotky
 */
import { Dispatch, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View} from "react-native";
import CardPicker from "./Picker"
import Deck from "./Deck";

import {Planechase, Bounty, Unknown} from "../cards.json";

interface MainProps {
    state:AppState,
    dispatch:Dispatch<AppAction>
}

const Items:Array<GameVersion[]> = [
    Planechase as GameVersion[],
    [Bounty]
]

export default function Main({state, dispatch}:MainProps) {
    const [list, setList] = useState<Array<GameVersion>>(Items[state.current]);

    /** Get Randomized List of Selected Cards
     * 
     * Uses eather the state stored or state passed in.
     * 
     * @returns {Array<CardBase>}
     */
    function getCards(cards:Array<GameVersion> = list):Array<CardBase> {
        const output:Array<CardBase> = [];

        for(const version of cards){
            for(const index in version.value){
                for(const card of version.value[index]) {

                    if(card.use) {
                        output.push(card);
                    }   
                       
                }
            }
        }

        return output;
    }

    /** Update List by Name in State.
     * 
     * Stores update in AsyncStorage
     * 
     * @param {string} name 
     * @param {CardList} value 
     */
    const updateListState = (name:string, value:CardList) => {
        const update = list.map((game)=>{
            if(game.name === name)
                game.value = value
            return game
        })
        AsyncStorage.setItem(state.current.toString(), JSON.stringify(update));
        setList(update);
    }

    useEffect(()=>{
        (async()=>{
            const value = await AsyncStorage.getItem(state.current.toString());

            let list:GameVersion[];
            if(value){
                list = JSON.parse(value);
            } else {
                list = Items[state.current]
            }

            setList(list)
        })()
    }, [state.current])

    return (
        <View>
            <CardPicker callback={updateListState} state={state} list={list}/>
            <Deck list={getCards()} state={state} dispatch={dispatch}/>
        </View> 
    );
}