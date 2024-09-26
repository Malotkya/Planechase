/** /src/Deck
 * 
 * @author Alex Malotky
 */
import {useState, useEffect, Dispatch} from 'react';
import { StyleSheet, View, Image, GestureResponderEvent } from 'react-native';
import Card from "./Card";
import Aside from './Aside';

interface DeckProps {
    list: Array<CardBase>,
    shuffle: (e:GestureResponderEvent)=>void,
    state:AppState,
    dispatch:Dispatch<AppAction>,
    additonal?:CardBase
}

export default function Deck({list = [], shuffle, state, dispatch, additonal}:DeckProps){

    const [index, setIndex] = useState(0);
    const double = additonal === undefined


    /** Deck Styling
     * 
     */
    const styles = StyleSheet.create({
        container: {
            display: "flex",
            flexDirection: state.direction? "row": "column-reverse",
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
        let i = index+1;
        if(i>=list.length)
            i=0;
        setIndex(i);
    }

    /** Get Previous Card
     * 
     */
    const prevCard = () => {
        let i = index-1;
        if(i<0)
            i=list.length-1;
        setIndex(i);
    }

    /** Pre-load the next images on card change.
     * 
     */
    useEffect(()=>{
        const next= list[index+1];
        if(next) {
            Image.prefetch(next.image_uri);
        }

        const prev = list[index-1];
        if(prev){
            Image.prefetch(prev.image_uri);
        }
    }, [index]);

    /** Pre-load the next images on list change.
     * 
     */
    useEffect(()=>{
        if(list.length > 1){
            Image.prefetch(list[1].image_uri);
            Image.prefetch(list[list.length-1].image_uri);
        }

    }, [list])

    return (
        <View style={styles.container}>
            <Aside onNext={nextCard} onPrev={prevCard} onShuffle={shuffle} state={state} dispatch={dispatch}/>
            <View style={styles.cardWrapper}>
                <Card card={list[index]} size={state.size} horizontal={double}/>
                {additonal? <Card card={additonal} size={state.size} horizontal={double} />: undefined}
            </View>
        </View>
    );
}