import {useState, useEffect} from "react"
import {ScrollView, View, Text, FlatList, StyleSheet} from "react-native";
import Checkbox from 'expo-checkbox';

import Card from "./Card";

const styles = StyleSheet.create({
    wrapper: {
        height: "35px",
        flexGrow: 1,
        display: "block"
    },
    column: {
        position: 'absolute',
        height: "400px",
        width: "100%",
        backgroundColor: "white"
    },
    title: {
        flexDirection: "row",
        backgroundColor: "lightgray"
    },
    titleText: {
        fontSize: "1.2em",
        textAlign: "center",
        flexGrow: 1
    }
});

export default function List(props){

    /** State Meaning:
     * -1: Mix of true/false amongst the cards
     *  0: All cards are false
     *  1: All cards are true
     */
    const [state, setState] = useState(-1);
    const list = props.list || [];
    const name = props.name || "";

    const updateList = value =>{
        for(let card of list)
            card.use = value;
        setState(+ value);
        props.update(name, list)
    }

    const updateCard = (index, value) =>{
        setState(-1);
        list[index].use = value;
        props.update(name, list);
    }

    useEffect(()=>{
        if(list.length > 0){
            let initState = list[0].use;

            if(initState !== undefined) {
                for(let i=1; i<props.list.length; i++){
                    if(initState !== props.list[i].use){
                        initState = undefined;
                        i = props.list.length;
                    }
                }
        
                if(initState === undefined) {
                    setState(-1);
                } else {
                    setState(+ initState);
                }
            }
        }
    }, [])

    return (
        <View style={styles.wrapper}>
            <View style={styles.title}>
                <Checkbox  value={state === 1} onValueChange={updateList} />
                <Text style={styles.titleText}>{name}</Text>
            </View>
            <ScrollView style={styles.column}>
                <FlatList data={list}
                        renderItem={item=><Card value={item.item}
                        onValueChange={(value)=>updateCard(item.index, value)}
                        key={item.index} />}
                />
            </ScrollView>
        </View>
    )
}