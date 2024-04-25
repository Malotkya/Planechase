/** /src/Picker
 * 
 * @author Alex Malotky
 */
import {useState, useEffect} from "react";
import {StyleSheet, View, TouchableOpacity, Text} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import Category from "./Category";

import { RATIO, BUTTON_DEFAULT, BUTTON_WIDTH, BUTTON_HEIGHT } from "../Constants";

interface PickerProps {
    size:number
    callback:Function,
    init: Array<GameVersion>
}

export default function CardPicker(props:PickerProps){
    const {size, callback, init} = props;
    if(typeof size !== "number")
        throw new TypeError("Size must be a number!");
    if(typeof callback !== "function")
        throw new TypeError("Callback must be a function!");
    if(typeof init !== "object")
        throw new TypeError("Init Data must be an object!");

    const [cards, setCards] = useState<Array<GameVersion>>([]);
    const [visible, setVisible] = useState(false);

    const WIDTH = size - BUTTON_WIDTH;

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
            left: BUTTON_WIDTH,
            flexDirection: "row",
            flexWrap: "nowrap",
            flexGrow: 1,
            width: WIDTH,
            overflow: "hidden"
        }
    });

    //const LIST_SIZE = Math.floor((size-BUTTON_WIDTH) * RATIO)-BUTTON_HEIGHT;

    const getList = (state?:Array<GameVersion>):Array<CardBase> =>{
        const output:Array<CardBase> = [];
        state = state || cards;

        for(let list of state!){
            for(let index in list.value){

                for(let card of list.value[index]) {
                    if(card.use)
                                output.push(card);
                }
            }
        }

        return output;
    }

    const updateState = (name:string, value:CardList) => {
        setCards((cards)=>{
            const c = Array.from(cards!);
            for(let game of c){
                if(game.name === name)
                    game.value = value;
            }
            AsyncStorage.setItem("Planechase", JSON.stringify(getList(c).map(card=>card.name)));
            return c;
        });
    }
    
    useEffect(()=>{
        if(cards.length === 0){
            AsyncStorage.getItem("Planechase").then(buffer=>{
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

    const flip = () =>{
        setVisible(!visible);
    }

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity onPress={flip}>
                <Text style={styles.button}>Card List</Text>
            </TouchableOpacity>
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