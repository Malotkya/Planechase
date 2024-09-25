/** /src/Bounty
 * 
 * @author Alex Malotky
 */
import { useState } from "react";
import {View} from "react-native";

import CardPicker from "./Picker"
import Deck from "./Deck";

/** Wanted Card
 * 
 */
const WANTED:CardBase = {
    "name": "Wanted!",
    "text": "Before the game, shuffle at least 6 unique bounty cards into a face-down pile.\nAs the starting player's third turn begins, reveal the top bounty card.\nClaim the revealed bounty during your turn and collect your reward!\nAs each turn begins, if no bounty is being offered, reveal the next one. If the pile is empty, shuffle all claimed bounties and restock\nIf the bounty went unclaimed last turn, increase its reward to the next level.\nRewards\n1 — Create a Treasure token\n2 — Create two Treasure tokens\n3 — Create two Treasure tokens *or* draw a card\n4 — (Max) Create two Treasure tokens *and* draw a card.",
    "type": "Card",
    "image_uri": "https://cards.scryfall.io/normal/back/a/c/acd27632-4c28-4dc3-90ad-b94fe176b91a.jpg?1712319002"
}

interface BountyProps {
    init: GameVersion,
    size:number,
    horizontal:boolean,
    visible: boolean
    flip: ()=>void
}

export default function Bounty(props:BountyProps) {
    //Validate Props
    const {init, size, horizontal, flip, visible} = props;
    if(typeof size !== "number")
        throw new TypeError("Size must be a number!");
    if(typeof init !== "object")
        throw new TypeError("Init must be an object!");

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
            <CardPicker callback={shuffleCards} size={size} init={[init]} visible={visible} storageKey="bounty" horizontal={horizontal}/>
            <Deck list={list} size={size} shuffle={()=>shuffleCards(list)} flipView={flip} additonal={WANTED} horizontal={horizontal}/>
        </View> 
    );
}