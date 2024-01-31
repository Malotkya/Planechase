/** /src/Deck
 * 
 * @author Alex Malotky
 */
import {useState, useEffect} from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';

import { BUTTON_WIDTH, BUTTON_DEFAULT } from '../Constants';
import Card from "./Card";

export default function Deck(props){
    
    const [index, setIndex] = useState(0);

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
        if(i>=props.list.length)
            i=0;
        setIndex(i);
    }

    /** Get Previous Card
     * 
     */
    const prevCard = () => {
        let i = index-1;
        if(i<0)
            i=props.list.length-1;
        setIndex(i);
    }

    /** Pre-load the next images on card change.
     * 
     */
    useEffect(()=>{
        const next= props.list[index+1];
        if(next) {
            Image.prefetch(next.image_uri);
        }

        const prev = props.list[index-1];
        if(prev){
            Image.prefetch(prev.image_uri);
        }
    }, [index]);

    /** Pre-load the next images on list change.
     * 
     */
    useEffect(()=>{
        if(props.list.length > 1){
            Image.prefetch(props.list[1].image_uri);
            Image.prefetch(props.list[props.list.length-1].image_uri);
        }

    }, [props.list])

    

    return (
        <View style={styles.container}>
            <View style={styles.buttonGroup}>
                <TouchableOpacity onPress={nextCard}>
                    <Text style={styles.button}>Next</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={prevCard}>
                    <Text style={styles.button}>Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shuffle} onPress={props.shuffle}>
                    <Text style={styles.button}>Shuffle</Text>
                </TouchableOpacity>
            </View>
            <View>
                <Card card={props.list[index]} size={props.size-BUTTON_WIDTH}/>
            </View>
        </View>
    );
}