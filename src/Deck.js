import {useState, useEffect} from 'react';
import { StyleSheet, View, Button } from 'react-native';

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
    button: {
      width: 100,
      height: 100
    }
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

    return (
        <View style={styles.container}>
            <View style={styles.buttonGroup}>
                <Button style={styles.button} onPress={nextCard} title="Next" />
                <Button style={styles.button} onPress={prevCard} title="Previous" />
            </View>
            <View>
                <Card card={props.list[index]} size={500}/>
            </View>
        </View>
    );
}
    
export default Deck;