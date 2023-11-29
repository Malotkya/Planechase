import {useState, useEffect} from "react"
import {ScrollView, View, Text, FlatList} from "react-native";
import Checkbox from 'expo-checkbox';

import Card from "./Card";

export default function List(props){
    const [state, setState] = useState(-1);
    const list = props.list || [];
    const name = props.name || "";

    const updateList = value =>{
        for(let card of list)
            card.use = value;
        setState(+ value);
        props.update(name, list)
    }

    const updateCard = (index, value) =>{
        setState(-1);
        list[index].use = value;
        props.update(name, list);
    }

    useEffect(()=>{
        if(list.length > 0){
            let initState = list[0].use;

            if(initState !== undefined) {
                for(let i=1; i<props.list.length; i++){
                    if(initState !== props.list[i].use){
                        initState = undefined;
                        i = props.list.length;
                    }
                }
        
                if(initState === undefined) {
                    setState(-1);
                } else {
                    setState(+ initState);
                }
            }
        }
    }, [])

    return (
        <ScrollView>
            <View>
                <Checkbox  value={state === 1} onValueChange={updateList} />
                <Text>{name}</Text>
            </View>
            <FlatList data={list}
                      renderItem={item=><Card value={item.item}
                      onValueChange={(value)=>updateCard(item.index, value)}
                      key={item.index} />}
            />
        </ScrollView>
    )
}