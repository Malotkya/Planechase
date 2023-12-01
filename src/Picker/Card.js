import {useState, useEffect} from "react";
import {TouchableOpacity, Text, StyleSheet} from "react-native";
import Checkbox from 'expo-checkbox';

export default function Card(props){
    const [state, setState] = useState(props.value.use);

    const styles = StyleSheet.create({
        touch: {
            padding: "3px",
            flexDirection: "row",
            borderBottomColor: "black",
            borderBottomWidth: 1
        },
        text: {
            paddingLeft: "5px"
        }
    })

    const update = () => {
        setState(!state);
        props.onValueChange(!state);
    }

    useEffect(()=>{
        setState(props.value.use);
    }, [props.value.use])

    return (
        <TouchableOpacity style={styles.touch} onPress={update}>
            <Checkbox value={state} />
            <Text style={styles.text}>{props.value.name}</Text>
        </TouchableOpacity>
    )
}