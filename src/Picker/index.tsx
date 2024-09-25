/** /src/Picker
 * 
 * @author Alex Malotky
 */
import {useState, useEffect} from "react";
import {StyleSheet, View, TouchableOpacity, Text} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import Category from "./Category";

import { BUTTON_DEFAULT, BUTTON_WIDTH } from "../Constants";

interface PickerProps {
    size:number
    callback:Function,
    init: Array<GameVersion>
    storageKey:string
    visible:boolean
}

export default function CardPicker(props:PickerProps){
    //Check Props
    const {size, callback, init, storageKey, visible} = props;
    if(typeof size !== "number")
        throw new TypeError("Size must be a number!");
    if(typeof callback !== "function")
        throw new TypeError("Callback must be a function!");
    if(typeof init !== "object")
        throw new TypeError("Init Data must be an object!");
    if(typeof storageKey !== "string")
        throw new TypeError("Storage Key must be a string!");

    const [cards, setCards] = useState<Array<GameVersion>>([]);

    /** Card Picker Styling
     * 
     */
    const styles = StyleSheet.create({
        wrapper: {
            width: size,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            zIndex: 99,
            elevation: 99,
            height: 0
        },
        button: BUTTON_DEFAULT,
        view: {
            display: visible? "flex": "none",
            position: "absolute",
            left: BUTTON_WIDTH + 1,
            flexDirection: "row",
            flexWrap: "nowrap",
            flexGrow: 1,
            overflow: "hidden"
        }
    });

    /** Get List of Selected Cqrds
     * 
     * Uses eather the state stored or state passed in.
     * 
     * @param {Array<GameVersion>} state 
     * @returns {Array<CardBase>}
     */
    const getList = (state:Array<GameVersion> = cards):Array<CardBase> =>{
        const output:Array<CardBase> = [];

        for(let list of state){
            for(let index in list.value){

                for(let card of list.value[index]) {
                    if(card.use)
                        output.push(card);
                }
            }
        }

        return output;
    }

    /** Update List by Name in State.
     * 
     * Stores update in AsyncStorage
     * 
     * @param {string} name 
     * @param {CardList} value 
     */
    const updateState = (name:string, value:CardList) => {
        setCards((cards)=>{
            const c = Array.from(cards!);
            for(let game of c){
                if(game.name === name)
                    game.value = value;
            }
            AsyncStorage.setItem(storageKey, JSON.stringify(getList(c).map(card=>card.name)));
            return c;
        });
    }
    
    /** Cards List State Change Effect
     * 
     * Restores state from AsyncStorage on first call.
     */
    useEffect(()=>{
        if(cards.length === 0){
            AsyncStorage.getItem(storageKey).then(buffer=>{
                const value:Array<string> = buffer? JSON.parse(buffer): [];

                for(let list of init){
                    for(let name in list.value){
        
                        list.value[name] = list.value[name].map(card=>{
                            card.use = value.length === 0 || value.includes(card.name);
                            return card;
                        });
                    }
                }
                setCards(init);
            });
        } else {
            callback(getList());
        }
    }, [cards]);

    return (
        <View style={styles.wrapper}>
            
            <View style={styles.view}>
                {cards.map((value, index)=>{
                    return <Category name={value.name}
                        list={value.value} key={index} size={size}
                        onUpdate={(update:CardList)=>updateState(value.name, update)} />
                })}
            </View>
        </View>
    )
}