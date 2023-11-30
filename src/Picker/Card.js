import {useState, useEffect} from "react";
import {View, Text} from "react-native";
import Checkbox from 'expo-checkbox';

export default function Card(props){
    const [state, setState] = useState(props.value.use);

    const update = value => {
        setState(value);
        props.onValueChange(value);
    }

    useEffect(()=>{
        setState(props.value.use);
    }, [props.value.use])

    return (
        <View style={{flexDirection: "row"}}>
            <Checkbox value={state} onValueChange={update}/>
            <Text>{props.value.name}</Text>
        </View>
    )
}