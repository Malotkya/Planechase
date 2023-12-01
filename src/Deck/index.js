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
            ...BUTTON_DEFAULT
        }
    });
     
    const nextCard = () => {
        let i = index+1;
        if(i>=props.list.length)
            i=0;
        setIndex(i);
    }

    const prevCard = () => {
        let i = index-1;
        if(i<0)
            i=props.list.length-1;
        setIndex(i);
    }

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

    return (
        <View style={styles.container}>
            <View style={styles.buttonGroup}>
                <TouchableOpacity onPress={nextCard}>
                    <Text style={styles.button}>Next</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={prevCard}>
                    <Text style={styles.button}>Previous</Text>
                </TouchableOpacity>
            </View>
            <View>
                <Card card={props.list[index]} size={props.size-BUTTON_WIDTH}/>
            </View>
        </View>
    );
}