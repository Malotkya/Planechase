/** /src/Planecahse
 * 
 * @author Alex Malotky
 */
import { useState } from "react";
import {View} from "react-native";

import CardPicker from "./Picker"
import Deck from "./Deck";

interface PlanechaseProps {
    init: Array<GameVersion>,
    size:number,
    horizontal:boolean
}

export default function Planechase(props:PlanechaseProps) {
    //Validate Props
    const {init = [], size, horizontal} = props;
    if(typeof size !== "number")
        throw new TypeError("Size must be a number!");

    const [list, setList] = useState<Array<CardBase>>([]);
    const [visible, setVisible] = useState(false);

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

    /** Flip Visbility
     * 
     */
    const flip = () =>{
        setVisible(!visible);
    }
    
    return (
        <View>
            <CardPicker callback={shuffleCards} size={size} init={init} visible={visible} storageKey="planechase"/>
            <Deck list={list} size={size} shuffle={()=>shuffleCards(list)} flipView={flip} horizontal={horizontal}/>
        </View> 
    );
}