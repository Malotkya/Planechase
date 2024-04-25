/** /src/Picker/Card
 * 
 * @author Alex Malotky
 */
import {useState, useEffect} from "react";
import {TouchableOpacity, Text, StyleSheet} from "react-native";
import Checkbox from 'expo-checkbox';
import { BUTTON_HEIGHT } from "../Constants";

interface CardProps {
    value:CardBase
    onValueChange: (value:boolean)=>void
}

export default function ListItem(props:CardProps){
    const {value = {}, onValueChange} = props;
    if(typeof onValueChange !== "function")
        throw new TypeError("onValueChange must be a function!");
    
    const {name = "undefined", use = false} = value as CardBase;
    const [state, setState] = useState(use);
    

    const styles = StyleSheet.create({
        touch: {
            padding: "3px",
            flexDirection: "row",
            borderBottomColor: "black",
            borderBottomWidth: 1,
            height: BUTTON_HEIGHT
        },
        text: {
            paddingLeft: "5px"
        }
    })

    const update = () => {
        setState(!state);
        onValueChange(!state);
    }

    useEffect(()=>{
        setState(use);
    }, [use])

    return (
        <TouchableOpacity style={styles.touch} onPress={update}>
            <Checkbox value={state} />
            <Text style={styles.text}>{name}</Text>
        </TouchableOpacity>
    )
}