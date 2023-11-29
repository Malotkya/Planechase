import {useState, useEffect} from "react";
import {View, Text, Button} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import initList from "../cards.json";

const CardList = (props) => {
    const [state, setState] = useState(undefined);

    const getList = () =>{
        const list = [];

        for(let attribute in state){
            for(let card of state[attribute]){
                if(card.use)
                    list.push(card);
            }
        }

        return list;
    }
    
    useEffect(()=>{
        if(state === undefined){
            AsyncStorage.getItem("state").then(value=>{
                if(value === null) {
                    value = {};
                    for(let name in initList){
                        value[name] = initList[name].map(card=>{
                            card.use = true;
                            return card;
                        });
                    }
    
                    setState(value);
                }
            });
        } else {
            props.callback(getList());
        }
    }, [state])

    return (
        <Text>Deck List</Text>

    )
}

export default CardList;