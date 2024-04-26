/** /src/Picker/Category
 * 
 * @author Alex Malotky
 */
import {useState, useEffect} from "react"
import {View, Text, FlatList, StyleSheet} from "react-native";
import Checkbox from 'expo-checkbox';

import {BUTTON_HEIGHT} from "../Constants"
import ListItem from "./ListItem";
import { fontSize } from "../Util";

interface ListProps {
    name:string
    onUpdate:(list:Array<CardBase>)=>void
    list:Array<CardBase>
    size:number
}

export default function List(props:ListProps){
    //Validate Props
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
    const HEIGHT = (list.length * fontSize(2.2, size)) + BUTTON_HEIGHT;

    /** Picker Sub List Styling
     * 
     */
    const styles = StyleSheet.create({
        wrapper: {
            flex: 1,
            display: "flex",
            flexGrow: 1,
            minHeight: HEIGHT,
            maxHeight: HEIGHT
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
            fontSize: fontSize(1.3, size),
            textAlign: "center",
            flexGrow: 1,
            lineHeight: BUTTON_HEIGHT
        },
        checkbox: {
            justifyContent: "center",
            padding: "3px"
        }
    });

    /** Update Sub List 
     * 
     * @param value 
     */
    const updateList = (value:boolean) =>{
        for(let card of list)
            card.use = value;
        setState(+ value);
        onUpdate(list);
    }

    /** Update Single Card
     * 
     * @param {number} index 
     * @param {boolean} value 
     */
    const updateCard = (index:number, value:boolean) =>{
        setState(-1);
        list[index].use = value;
        onUpdate(list);
    }

    /** Init Effect
     * 
     * Sets Entire list to true if card.use is undefined
     * and sets inital state based on list use settings.
     * 
     */
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
            <FlatList data={list} style={{overflow:"visible"}}
                    renderItem={
                        (it)=>{
                            return (<ListItem value={it.item} onValueChange={(value:boolean)=>updateCard(it.index, value)} key={it.index} />)
                        }
                    }
                />
        </View>
    )
}