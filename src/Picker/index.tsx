/** /src/Picker
 * 
 * @author Alex Malotky
 */
import {useState, useEffect} from "react";
import {StyleSheet, View, TouchableOpacity, GestureResponderEvent} from "react-native";

import Category from "./Category";

import { BUTTON_DEFAULT, BUTTON_WIDTH } from "../Constants";


interface PickerProps {
    callback:Function,
    state:AppState,
    list:GameVersion[]
}

export default function CardPicker({callback, state, list}:PickerProps){

    /** Card Picker Styling
     * 
     */
    const styles = StyleSheet.create({
        wrapper: {
            width: state.size,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            zIndex: 99,
            elevation: 99,
            height: 0
        },
        button: BUTTON_DEFAULT,
        modal: {
            display: state.selectModal? "flex": "none",
            position: "absolute",
            left: state.direction? BUTTON_WIDTH + 1: undefined,
            flexDirection: "row",
            flexWrap: "nowrap",
            flexGrow: 1,
            overflow: "hidden"
        }
    });

    const stopPropagation = (e:GestureResponderEvent) => e.stopPropagation()

    return (
        <View style={styles.wrapper}>
            
            <TouchableOpacity style={styles.modal} onPress={stopPropagation} activeOpacity={1}>
                {list.map((value, index)=>{
                    return <Category name={value.name}
                        list={value.value} key={index} size={state.size}
                        onUpdate={(update:CardList)=>callback(value.name, update)} />
                })}
            </TouchableOpacity>
        </View>
    )
}