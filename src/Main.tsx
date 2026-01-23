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

export const Items:Array<GameVersion[]> = [
    Planechase as GameVersion[],
    [Bounty]
]

export default function Main({state, dispatch}:MainProps) {
    const [deck, setDeck] = useState({
        current: state.current,
        allCards: Items[state.current],
        selected: getSelected(Items[state.current])
    });

    /** Get List of Selected Cards
     * 
     * Uses eather the state stored or state passed in.
     * 
     * @returns {Array<CardBase>}
     */
    function getSelected(cards:GameVersion[]):Array<CardBase> {
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
    const updateDeckState = (name:string, value:CardList) => {
        setDeck(({allCards, current}:typeof deck)=>{
            const update = allCards.map((game)=>{
                if(game.name === name)
                    game.value = value
                return game
            });

            AsyncStorage.setItem(deck.current.toString(), JSON.stringify(update));

            return {
                allCards: update,
                current,
                selected: getSelected(update)
            }
        });
    }

    const loadCurrentList = () => {
        AsyncStorage.getItem(state.current.toString()).then(value=>{
            let list:GameVersion[];
            if(value) {
                list = JSON.parse(value);
            } else {
                list = Items[state.current];
            }

            setDeck({
                current: state.current,
                allCards: list,
                selected: getSelected(list)
            })
        });
    }

    useEffect(()=>{
        if(state.current !== deck.current) {
            loadCurrentList()
        }
    }, [state.current]);

    useEffect(()=>{
        loadCurrentList()
    }, []);

    console.debug("Main");

    return (
        <View>
            <CardPicker callback={updateDeckState} state={state} list={deck.allCards}/>
            <Deck list={deck.selected} state={state} dispatch={dispatch}/>
        </View> 
    );
}