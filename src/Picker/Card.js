import {useState} from "react";
import {View, Text} from "react-native";
import Checkbox from 'expo-checkbox';

export default function Card(props){
    const [state, setState] = useState(props.value.use);

    const update = value => {
        setState(value);
        props.onValueChange(value);
    }

    return (
        <View>
            <Checkbox value={state} onValueChange={setState}/>
            <Text>{props.value.name}</Text>
        </View>
    )
}