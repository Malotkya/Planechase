import {useState, useEffect} from "react";
import {StyleSheet, View, Button} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import List from "./Category";
import allCards from "../../cards.json";

export default function CardPicker(props){
    const [cards, setCards] = useState(undefined);
    const [visible, setVisible] = useState(false);

    const styles = StyleSheet.create({
        view: {
            position: 'absolute',
            display: visible? "block": "none"
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
        list.push(<List name={name} list={cards[name]} update={updateState} key={name}/>)
    }

    return (
        <View>
            <Button title="Card List" onPress={flip}/>
            <View style={styles.view}>
                {list}
            </View>
        </View>
    )
}