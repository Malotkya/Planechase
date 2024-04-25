import { useState } from "react";
import {View, StyleProp, ViewStyle} from "react-native";

import CardPicker from "./Picker"
import Deck from "./Deck";

interface PlanechaseProps {
    init: Array<GameVersion>,
    size:number
}

export default function Planechase(props:PlanechaseProps) {
    const {init = [], size} = props;
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
            <CardPicker callback={shuffleCards} size={size} init={init}/>
            <Deck list={list} size={size} shuffle={()=>shuffleCards(list)}/>
        </View> 
    );
}