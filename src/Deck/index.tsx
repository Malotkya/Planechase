/** /src/Deck
 * 
 * @author Alex Malotky
 */
import {useState, useEffect} from 'react';
import { StyleSheet, View, Image, GestureResponderEvent } from 'react-native';
import { BUTTON_WIDTH } from '../Constants';
import Card from "./Card";
import Aside from './Aside';

interface DeckProps {
    list: Array<CardBase>,
    size:number,
    shuffle: (e:GestureResponderEvent)=>void,
    flipView: (e:GestureResponderEvent)=>void,
    additonal?:CardBase,
    horizontal: boolean
}

export default function Deck(props:DeckProps){
    //Validate Props
    const {list = [], size, shuffle, flipView, additonal, horizontal} = props;
    if(typeof size !== "number")
        throw new TypeError("Size must be a number!");
    if(typeof shuffle !== "function")
        throw new TypeError("Update must be a function!");
    if(typeof shuffle !== "function")
        throw new TypeError("Flip View must be a function!");

    const [index, setIndex] = useState(0);
    const double = additonal === undefined


    /** Deck Styling
     * 
     */
    const styles = StyleSheet.create({
        container: {
            display: "flex",
            flexDirection: horizontal? "row": "column-reverse",
            flexWrap: "nowrap"
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
            <Aside onNext={nextCard} onPrev={prevCard} onShuffle={shuffle} onShow={flipView} horizontal={horizontal}/>
            <View style={{flexDirection: "row"}}>
                <Card card={list[index]} size={size} horizontal={double}/>
                {additonal? <Card card={additonal} size={size} horizontal={double} />: undefined}
            </View>
        </View>
    );
}