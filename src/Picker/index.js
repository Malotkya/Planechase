import {useState, useEffect} from "react";
import {StyleSheet, View, TouchableOpacity, Text} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import List from "./Category";
import allCards from "../../cards.json";

import { RATIO } from "../Deck/Card";

export default function CardPicker(props){
    const [cards, setCards] = useState(undefined);
    const [visible, setVisible] = useState(false);

    const styles = StyleSheet.create({
        wrapper: {
            width: `${props.size}px`,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            zIndex: 99,
            elevation: 99,
            height: "0px",
            overflow: "visible"
        },
        button: {
            width: "100px",
            height: "35px",
            flexGrow: 1,
            backgroundColor: "rgb(33, 150, 243)",
            color: "white",
            padding: "8px",
            textTransform: "uppercase",
            textAlign: "center",
        },
        view: {
            display: visible? "flex": "none",
            flexDirection: "row",
            flexWrap: "nowrap",
            flexGrow: 1,
        }
    });

    const getList = (state) =>{
        const output = [];
        state = state || cards;

        for(let name in state){
            for(let card of cards[name]){
                if(card.use)
                    output.push(card);
            }
        }

        return output;
    }

    const updateState = (name, value) => {
        setCards((cards)=>{
            const c = {...cards};
            c[name] = value;
            AsyncStorage.setItem("state", JSON.stringify(getList(c).map(card=>card.name)));
            return c;
        });
    }
    
    useEffect(()=>{
        if(cards === undefined){
            AsyncStorage.getItem("state").then(value=>{

                if(value !== null) {
                    value = JSON.parse(value);
                } else {
                    value = [];
                }

                for(let name in allCards){
                    allCards[name] = allCards[name].map(card=>{
                        card.use = value.length === 0 || value.includes(card.name);
                        return card;
                    });
                }

                setCards(allCards);
            });
        } else {
            props.callback(getList());
        }
    }, [cards]);

    const flip = () =>{
        setVisible(!visible);
    }

    const list = [];
    for(let name in cards){
        if(cards[name].length > 0)
            list.push(<List name={name} list={cards[name]} update={updateState} key={name} size={Math.floor((props.size-100) * RATIO)-35}/>)
    }

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity onPress={flip}>
                <Text style={styles.button}>Card List</Text>
            </TouchableOpacity>
            <View style={styles.view}>
                {list}
            </View>
        </View>
    )
}