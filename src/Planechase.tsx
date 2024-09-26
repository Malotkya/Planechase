/** /src/Planecahse
 * 
 * @author Alex Malotky
 */
import { Dispatch, useState } from "react";
import {View} from "react-native";

import CardPicker from "./Picker"
import Deck from "./Deck";

interface PlanechaseProps {
    init: Array<GameVersion>
    state:AppState,
    dispatch:Dispatch<AppAction>
}

export default function Planechase({init = [], state, dispatch}:PlanechaseProps) {
    const [list, setList] = useState<Array<CardBase>>([]);

    /** Shuffle Cards
     * 
     * @param {Array<Cards>} list 
     */
    const shuffleCards = (list:Array<CardBase>) => {
        const newList = [];
        const input = JSON.parse(JSON.stringify(list));

        while(input.length > 0){
            let index = Math.floor(Math.random() * input.length);
            newList.push(input[index]);
            input.splice(index, 1);
        }

        setList(newList);
    }
    
    return (
        <View>
            <CardPicker callback={shuffleCards} init={init} storageKey="planechase" state={state}/>
            <Deck list={list} shuffle={()=>shuffleCards(list)} state={state} dispatch={dispatch} />
        </View> 
    );
}