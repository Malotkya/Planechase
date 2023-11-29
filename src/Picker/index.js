import {useState, useEffect} from "react";
import {StyleSheet, View, Button} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import List from "./Category";
import initList from "../../cards.json";

export default function CardPicker(props){
    const [cards, setCards] = useState(undefined);
    const [visible, setVisible] = useState(false);

    const styles = StyleSheet.create({
        view: {
            position: 'absolute',
            display: visible? "block": "none"
        }
    });

    const getList = () =>{
        const output = [];

        for(let name in cards){
            for(let card of cards[name]){
                if(card.use)
                    output.push(card);
            }
        }

        return output;
    }

    const updateState = (name, value) => {
        setCards((cards)=>{
            cards[name] = value;
            AsyncStorage.setItem("state", JSON.stringify(cards));
            return cards;
        });
    }
    
    useEffect(()=>{
        if(cards === undefined){
            AsyncStorage.getItem("state").then(value=>{

                if(value !== null) {
                    value = JSON.parse(value);
                } else {
                    value = {}
                    for(let name in initList){
                        value[name] = initList[name].map(card=>{
                            card.use = true;
                            return card;
                        });
                    }
                }

                setCards(value);
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