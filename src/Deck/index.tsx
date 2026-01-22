/** /src/Deck
 * 
 * @author Alex Malotky
 */
import {useState, Dispatch, useEffect} from 'react';
import { StyleSheet, View } from 'react-native';
import Card from "./Card";
import Aside from './Aside';

interface DeckProps {
    list:Array<CardBase>,
    state:AppState,
    dispatch:Dispatch<AppAction>
}

/** Wanted Card
 * 
 */
const WANTED:CardBase = {
    name: "Wanted!",
    text: "Before the game, shuffle at least 6 unique bounty cards into a face-down pile.\nAs the starting player's third turn begins, reveal the top bounty card.\nClaim the revealed bounty during your turn and collect your reward!\nAs each turn begins, if no bounty is being offered, reveal the next one. If the pile is empty, shuffle all claimed bounties and restock\nIf the bounty went unclaimed last turn, increase its reward to the next level.\nRewards\n1 — Create a Treasure token\n2 — Create two Treasure tokens\n3 — Create two Treasure tokens *or* draw a card\n4 — (Max) Create two Treasure tokens *and* draw a card.",
    type: "Card",
    image_uri: "https://cards.scryfall.io/normal/back/a/c/acd27632-4c28-4dc3-90ad-b94fe176b91a.jpg?1712319002",
    use: true
}

function shuffle_helper(input:CardBase[]):CardBase[] {
    input = Array.from(input); //Dont destroy original list.
    const output: CardBase[] = [];

    while(input.length > 0){
        let index = Math.floor(Math.random() * input.length);
        output.push(
            input.splice(index, 1)[0]
        );
    }

    return output;
}

export default function Deck({list, state:appState, dispatch}:DeckProps){
    const [state, setState] = useState({
        index: 0,
        list: list
    });
    const isBounty = appState.current !== 0;
    
    /** Deck Styling
     * 
     */
    const styles = StyleSheet.create({
        container: {
            display: "flex",
            flexDirection: appState.direction? "row": "column-reverse",
            flexWrap: "nowrap",
            gap: 1
        },
        cardWrapper: {
            flexDirection: "row",
            justifyContent: "center"
        }
    });
    
    /** Get Next Card
     * 
     */
    const nextCard = () => {
        setState((({index, list})=>{
            index += 1;
            if(index >= list.length)
                index = 0;

            return {index, list}
        }))
    }

    /** Get Previous Card
     * 
     */
    const prevCard = () => {
        setState((({index, list})=>{
            index -= 1;
            if(index < 0)
                index = list.length-1;

            return {index, list}
        }))
    }

    const shuffle = () => {
        setState(({list})=>{
            return {
                list: shuffle_helper(list),
                index: 0
            };
        });
    }

    useEffect(()=>{
        setState({
            index: 0,
            list: shuffle_helper(list)
        });
    }, [list])

    return (
        <View style={styles.container}>
            <Aside onNext={nextCard} onPrev={prevCard} onShuffle={shuffle} state={appState} dispatch={dispatch}/>
            <View style={styles.cardWrapper}>
                <Card card={state.list[state.index]} size={appState.size} horizontal={!isBounty}/>
                {isBounty? <Card card={WANTED} size={appState.size} horizontal={!isBounty} />: undefined}
            </View>
        </View>
    );
}