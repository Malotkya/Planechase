import {useState, useEffect} from 'react';
import { StyleSheet, View, Button, Image } from 'react-native';

import Card from "./Card";

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap"
    },
    buttonGroup: {
      width: 100,
      justifyContent: "center"
    },
});

const Deck = props => {
    const [index, setIndex] = useState(0);
     
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
    });

    return (
        <View style={styles.container}>
            <View style={styles.buttonGroup}>
                <Button onPress={nextCard} title="Next" />
                <Button onPress={prevCard} title="Previous" />
            </View>
            <View>
                <Card card={props.list[index]} size={props.size-100}/>
            </View>
        </View>
    );
}
    
export default Deck;