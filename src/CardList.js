import {useState, useEffect} from "react";
import {View, Text, Button} from "react-native";

import list from "./cards.json";

const STORAGE_KEY = "PlanechaseOptions"

const saveCardsUsed = async(value) => {
    console.log(value);
}

const getCardsUsed = async() => {
    return undefined
}

const CardList = (props) => {
    const [state, setState] = useState(undefined);
    
    useEffect(()=>{
        if(typeof state === "undefined"){
            setState(list.Plane);
        } else {
            props.list.push(...state);
        }
    }, [state])

    return (
        <Text>Deck List</Text>
    )
}

export default CardList;