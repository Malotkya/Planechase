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
      width: 100
    },
    button: {
      width: 100,
      height: 100
    }
});

const Deck = props => {
    
    const [list, setList] = useState(0);
    const [index, setIndex] = useState(0);
    
    const nextCard = () => {
        let i = index+1;
        if(i>=list.length)
            i=0;
        setIndex(i);
    }

    const prevCard = () => {
        let i = index-1;
        if(i<0)
            i=list.length-1;
        setIndex(i);
    }
    useEffect(()=>{
        const newList = [];
        const input = JSON.parse(JSON.stringify(props.list));
        
        while(input.length > 0){
            let index = Math.floor(Math.random() * input.length);
            newList.push(input[index]);
            input.splice(index, 1);
        }

        setList(newList);
    }, [props.list]);

    return (
        <View style={styles.container}>
            <View style={styles.buttonGroup}>
                <Button style={styles.button} onPress={nextCard} title="Next" />
                <Button style={styles.button} onPress={prevCard} title="Previous" />
            </View>
            <View>
                <Card card={list[index]} size={500}/>
            </View>
        </View>
    );
}
    
    export default Deck;