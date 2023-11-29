import {useState, useEffect} from "react";
import {View, Text, Button} from "react-native";

import list from "../cards.json";

const STORAGE_KEY = "PlanechaseOptions"

const CardList = (props) => {
    const [state, setState] = useState(undefined);
    
    useEffect(()=>{
        props.callback(list.Plane)
    }, [])

    return (
        <Text>Deck List</Text>
    )
}

export default CardList;