/** /src/Picker
 * 
 * @author Alex Malotky
 */
import {useState, useEffect, Component} from "react";
import {StyleSheet, View, TouchableOpacity, Text} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import List from "./Category";

import { RATIO, BUTTON_DEFAULT, BUTTON_WIDTH, BUTTON_HEIGHT } from "../Constants";

/** Card Picker
 * 
 * @param {{callback:Function, size:number, init:Object}} props 
 * @returns {Component}
 */
export default function CardPicker(props){
    const [cards, setCards] = useState(undefined);
    const [visible, setVisible] = useState(false);

    console.debug(JSON.parse(props.init, null, 2));

    if(typeof props.size === "undefined")
        throw new TypeError("Need to know the size of the card picker!");

    const LIST_SIZE = Math.floor((props.size-BUTTON_WIDTH) * RATIO)-BUTTON_HEIGHT;

    const styles = StyleSheet.create({
        wrapper: {
            width: props.size,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            zIndex: 99,
            elevation: 99,
            height: 0,
            overflow: "visible"
        },
        button: {
            ...BUTTON_DEFAULT
        },
        view: {
            display: visible? "flex": "none",
            flexDirection: "row",
            flexWrap: "nowrap",
            flexGrow: 1,
        }
    });

    /** Get List
     * 
     * @param {Object} state 
     * @returns {Array}
     */
    const getList = (state) =>{
        const output = [];
        state = state || cards;

        for(let name in state){
            for(let card of state[name]){
                if(card.use)
                    output.push(card);
            }
        }

        return output;
    }

    const updateState = (name, value) => {
        setCards((cards)=>{
            const c = {...cards};
            c[name] = value;
            AsyncStorage.setItem("Planechase", JSON.stringify(getList(c).map(card=>card.name)));
            return c;
        });
    }
    
    useEffect(()=>{
        if(cards === undefined){
            AsyncStorage.getItem("Planechase").then(value=>{

                if(value !== null) {
                    value = JSON.parse(value);
                } else {
                    value = [];
                }

                for(let cat of Object.getOwnPropertyNames(props.init)){
                    const list = props.init[cat];

                    for(let name of Object.getOwnPropertyNames(list)) {
                        props.init[cat] = list[name].map(card=>{
                            card.use = value.length === 0 || value.includes(card.name);
                            return card;
                        });
                    }
                }

                setCards(props.init);
            });
        } else {
            props.callback(getList());
        }
    }, [cards]);

    const flip = () =>{
        setVisible(!visible);
    }

    const list = [];
    for(let name in cards){
        if(cards[name].length > 0)
            list.push(<List name={name} list={cards[name]} update={updateState} key={name} size={LIST_SIZE}/>)
    }

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity onPress={flip}>
                <Text style={styles.button}>Card List</Text>
            </TouchableOpacity>
            <View style={styles.view}>
                {list}
            </View>
        </View>
    )
}