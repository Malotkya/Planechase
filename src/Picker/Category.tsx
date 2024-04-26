/** /src/Picker/Category
 * 
 * @author Alex Malotky
 */
import React, {useState} from "react"
import {ScrollView, View, Text, StyleSheet} from "react-native";
import Checkbox from 'expo-checkbox';

import {BUTTON_HEIGHT, BUTTON_WIDTH, RATIO} from "../Constants"
import {fontSize} from "../Util";
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
        throw new TypeError("Size must be a number!");
    if(typeof onUpdate !== "function")
        throw new TypeError("Update must be a function!");

    /** State Meaning:
     * -1: Mix of true/false amongst the cards
     *  0: All cards are false
     *  1: All cards are true
     */
    const [state, setState] = useState(-1);
    const HEIGHT = Math.floor((size - BUTTON_WIDTH) * RATIO) - BUTTON_HEIGHT;

    const styles = StyleSheet.create({
        wrapper: {
            width: "50%",
            display: "block" //TODO: Find way to not break display without this!
        },
        scrollOuter: {
            height: HEIGHT,
            width: "100%",
            backgroundColor: "white",
            borderColor: "black",
            borderWidth: 1
        },
        scrollInner: {
            flexGrow: 1,
            display: "flex",
            minHeight: "min-content",
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
            fontSize: fontSize(1.5, size),
            textAlign: "center",
            flexGrow: 1,
            lineHeight: BUTTON_HEIGHT,
            fontWeight: "bold"
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
            <ScrollView style={styles.scrollOuter} contentContainerStyle={styles.scrollInner}> 
                {iterate()}
            </ScrollView>
        </View>
    )
}