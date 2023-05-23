import {useState} from 'react';
import { StyleSheet, View, Button } from 'react-native';

import Card from "./Card";

const array = [];
const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap"
    },
    buttonGroup: {
      width: 100
    },
    button: {
      width: 100,
      height: 100
    }
});

const Deck = props => {
    
    while(props.list.length > 0){
        let index = Math.floor(Math.random() * props.list.length);
        array.push(props.list[index]);
        props.list.splice(index, 1);
    }

    const [index, setIndex] = useState(0);
    
    const nextCard = () => {
        let i = index+1;
        if(i>=array.length)
            i=0;
        setIndex(i);
    }

    const prevCard = () => {
        let i = index-1;
        if(i<0)
            i=array.length-1;
        setIndex(i);
    }
    return (
        <View style={styles.container}>
            <View style={styles.buttonGroup}>
                <Button style={styles.button} onPress={nextCard} title="Next" />
                <Button style={styles.button} onPress={prevCard} title="Previous" />
            </View>
            <View>
                <Card card={array[index]} size={500}/>
            </View>
        </View>
    );
}
    
    export default Deck;