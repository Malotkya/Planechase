/** /src/Deck
 * 
 * @author Alex Malotky
 */
import {useState, useEffect} from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';

import { BUTTON_WIDTH, BUTTON_DEFAULT } from '../Constants';
import Card from "./Card";

interface DeckProps {
    list: Array<CardBase>,
    size:number,
    shuffle:Function
    additonal?:CardBase
}

export default function Deck(props:DeckProps){
    //Validate Props
    const {list = [], size, shuffle, additonal} = props;
    if(typeof size !== "number")
        throw new TypeError("Size must be a number!");
    if(typeof shuffle !== "function")
        throw new TypeError("Update must be a function!");

    const [index, setIndex] = useState(0);
    const horizontal = additonal === undefined


    /** Deck Styling
     * 
     */
    const styles = StyleSheet.create({
        container: {
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap"
        },
        buttonGroup: {
          width: BUTTON_WIDTH,
          justifyContent: "center"
        },
        button: {
            ...BUTTON_DEFAULT,
            margin: 3
        },
        shuffle: {
            marginTop: "5%"
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
            <View style={styles.buttonGroup}>
                <TouchableOpacity onPress={nextCard}>
                    <Text style={styles.button}>Next</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={prevCard}>
                    <Text style={styles.button}>Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shuffle} onPress={()=>shuffle()}>
                    <Text style={styles.button}>Shuffle</Text>
                </TouchableOpacity>
            </View>
            <View style={{flexDirection: "row"}}>
                <Card card={list[index]} size={size-BUTTON_WIDTH} horizontal={horizontal}/>
                {additonal? <Card card={additonal} size={size-BUTTON_WIDTH} horizontal={horizontal} />: undefined}
            </View>
        </View>
    );
}