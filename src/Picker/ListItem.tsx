/** /src/Picker/Card
 * 
 * @author Alex Malotky
 */
import {useState, useEffect} from "react";
import {TouchableOpacity, Text, StyleSheet} from "react-native";
import Checkbox from 'expo-checkbox';
import { BUTTON_HEIGHT } from "../Constants";
import { fontSize } from "../Util";

interface CardProps {
    value:CardBase
    onValueChange: (value:boolean)=>void,
    size:number
}

export default function ListItem(props:CardProps){
    //Validate props
    const {value = {}, onValueChange, size} = props;
    if(typeof size !== "number")
            throw new TypeError("Size must be a number!");
    if(typeof onValueChange !== "function")
        throw new TypeError("onValueChange must be a function!");
    
    const {name = "undefined", use = false} = value as CardBase;
    const [state, setState] = useState(use);
    

    /** Picker List Item Styling
     * 
     */
    const styles = StyleSheet.create({
        touch: {
            padding: "3px",
            flexDirection: "row",
            borderBottomColor: "black",
            borderBottomWidth: 1
        },
        text: {
            paddingLeft: "5px",
            fontSize: fontSize(1.2, size)
        }
    })

    /** Toggle and Update Card
     * 
     */
    const update = () => {
        setState(!state);
        onValueChange(!state);
    }

    /** Update state if item is changed externally.
     * 
     */
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