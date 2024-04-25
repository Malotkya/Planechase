/** /src/Picker/Category
 * 
 * @author Alex Malotky
 */
import {useState, useEffect} from "react"
import {View, Text, FlatList, StyleSheet} from "react-native";
import Checkbox from 'expo-checkbox';

import {BUTTON_HEIGHT} from "../Constants"
import Card from "./Card";

/**
 * 
 * @param {{name:string, list:Array, size:number, update:Function}} props 
 * @returns {Component}
 */
export default function List(props){

    /** State Meaning:
     * -1: Mix of true/false amongst the cards
     *  0: All cards are false
     *  1: All cards are true
     */
    const [state, setState] = useState(-1);

    if(typeof props.size !== "number")
        throw new TypeError("Need to know the size of the List!");

    const list = props.list || [];
    const name = props.name || "undefined";

    const styles = StyleSheet.create({
        wrapper: {
            width: "50%",
            height: BUTTON_HEIGHT,
            flexGrow: 1,
            display: "block",
        },
        column: {
            position: 'absolute',
            height: props.size,
            width: "100%",
            backgroundColor: "white",
            borderColor: "black",
            borderWidth: 1,
        },
        title: {
            flexDirection: "row",
            backgroundColor: "lightgray",
            height: BUTTON_HEIGHT,
            borderColor: "black",
            borderWidth: 1,
            borderBottomWidth: 0
        },
        titleText: {
            fontSize: "1.2em",
            textAlign: "center",
            flexGrow: 1,
            lineHeight: BUTTON_HEIGHT
        },
        checkbox: {
            justifyContent: "center",
            padding: "3px"
        }
    });

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
    });

    return (
        <View style={styles.wrapper}>
            <View style={styles.title}>
                <View style={styles.checkbox}>
                    <Checkbox  value={state === 1} onValueChange={updateList} />
                </View>
                <Text style={styles.titleText}>{name}</Text>
            </View>
            <FlatList data={list}
                    renderItem={
                        (it)=>{
                            return (<Card value={it.item} onValueChange={(value)=>updateCard(it.index, value)} key={it.index} />)
                        }
                    }
                />
        </View>
    )
}