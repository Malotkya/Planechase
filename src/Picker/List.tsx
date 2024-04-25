/** /src/Picker/Category
 * 
 * @author Alex Malotky
 */
import {useState, useEffect} from "react"
import {View, Text, FlatList, StyleSheet} from "react-native";
import Checkbox from 'expo-checkbox';

import {BUTTON_HEIGHT} from "../Constants"
import Card from "./Card";
import { fontSize } from "../Util";

interface ListProps {
    name:string
    onUpdate:(list:Array<CardBase>)=>void
    list:Array<CardBase>
    size:number
}

export default function List(props:ListProps){
    const {size, list = [], onUpdate, name = "undefined"} = props;
    if(typeof size !== "number")
        throw new TypeError("Size must be a number!");
    if(typeof onUpdate !== "function")
        throw new TypeError("Update must be a function!");

    /** State Meaning:
     * -1: Mix of true/false amongst the cards
     *  0: All cards are false
     *  1: All cards are true
     */
    const [state, setState] = useState(-1);

    const styles = StyleSheet.create({
        wrapper: {
            width: "50%",
            height: BUTTON_HEIGHT,
            flexGrow: 1,
            //display: "block",
        },
        column: {
            position: 'absolute',
            height: size,
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
            fontSize: fontSize(1.2, size),
            textAlign: "center",
            flexGrow: 1,
            lineHeight: BUTTON_HEIGHT
        },
        checkbox: {
            justifyContent: "center",
            padding: "3px"
        }
    });

    const updateList = (value:boolean) =>{
        for(let card of list)
            card.use = value;
        setState(+ value);
        onUpdate(list);
    }

    const updateCard = (index:number, value:boolean) =>{
        setState(-1);
        list[index].use = value;
        onUpdate(list);
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
                            return (<Card value={it.item} onValueChange={(value:boolean)=>updateCard(it.index, value)} key={it.index} />)
                        }
                    }
                />
        </View>
    )
}