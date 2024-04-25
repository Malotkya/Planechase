/** /src/Picker/Category
 * 
 * @author Alex Malotky
 */
import React, {useState} from "react"
import {ScrollView, View, Text, StyleSheet} from "react-native";
import Checkbox from 'expo-checkbox';

import {BUTTON_HEIGHT} from "../Constants"
import List from "./List";

interface CategoryProps {
    name:string
    list:CardList
    onUpdate:(list:CardList)=>void
    size:number
}

export default function Category(props:CategoryProps){
    const {name = "undefined", list = {}, size, onUpdate} = props;
    if(typeof size !== "number")
        throw new TypeError("Need to know the size of the Category!");
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
            fontSize: 1.2, //em
            textAlign: "center",
            flexGrow: 1,
            lineHeight: BUTTON_HEIGHT
        },
        checkbox: {
            justifyContent: "center",
            padding: "3px"
        }
    });

    /** Update Category
     * 
     * @param {boolean} value 
     */
    const updateCategory = (value:boolean) => {
        for(let name in list) {
            for(let card of list[name]) {
                card.use = value;
            }
        }

        setState(+ value);
        onUpdate(list);
    }

    /** Update List
     * 
     * @param {string} name 
     * @param {Array} value 
     */
    const updateList = (name:string, value:Array<CardBase>) =>{
        setState(-1);
        list[name] = value;
        onUpdate(list);
    }

    const iterate = () => {
        const output:Array<React.JSX.Element> = [];

        for(let name in list){
            output.push(
                <List name={name} list={list[name]} key={name} size={size}
                      onUpdate={(update:Array<CardBase>)=>updateList(name, update)} />
            );
        }

        return output;
    }

    return (
        <View style={styles.wrapper}>
            <View style={styles.title}>
                <View style={styles.checkbox}>
                    <Checkbox  value={state === 1} onValueChange={updateCategory} />
                </View>
                <Text style={styles.titleText}>{name}</Text>
            </View>
            <ScrollView style={styles.column}>
                {iterate()}
            </ScrollView>
        </View>
    )
}