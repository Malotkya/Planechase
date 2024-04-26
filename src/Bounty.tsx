import { useState } from "react";
import {View} from "react-native";

import CardPicker from "./Picker"
import Deck from "./Deck";

interface BountyProps {
    init: GameVersion,
    size:number
}

const WANTED = {
    "name": "Wanted!",
    "text": "Before the game, shuffle at least 6 unique bounty cards into a face-down pile.\nAs the starting player's third turn begins, reveal the top bounty card.\nClaim the revealed bounty during your turn and collect your reward!\nAs each turn begins, if no bounty is being offered, reveal the next one. If the pile is empty, shuffle all claimed bounties and restock\nIf the bounty went unclaimed last turn, increase its reward to the next level.\n\nRewards\n1 — Create a Treasure token\n2 — Create two Treasure tokens\n3 — Create two Treasure tokens *or* draw a card\n4 — (Max) Create two Treasure tokens *and* draw a card.",
    "type": "Card",
    "image_uri": "https://cards.scryfall.io/normal/back/a/c/acd27632-4c28-4dc3-90ad-b94fe176b91a.jpg?1712319002"
  }

export default function Bounty(props:BountyProps) {
    const {init, size} = props;
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
            <CardPicker callback={shuffleCards} size={size} init={[init]} storageKey="bounty"/>
            <Deck list={list} size={size} shuffle={()=>shuffleCards(list)} additonal={WANTED}/>
        </View> 
    );
}