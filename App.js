import { StatusBar } from 'expo-status-bar';
import { useState } from 'react'
import { StyleSheet, View, Linking, Text, Button } from 'react-native';

import CardPicker from "./src/Picker"
import Deck from "./src/Deck";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    footer: {
      width: '100%',
      textAlign: "center"
    }
});

export default function App() {
    const [list, setList] = useState([]);

    const shuffleCards = list =>{
        const newList = [];
        const input = JSON.parse(JSON.stringify(list));

        while(input.length > 0){
            let index = Math.floor(Math.random() * input.length);
            newList.push(input[index]);
            input.splice(index, 1);
        }

        setList(newList);
    }

    return (
        <View style={styles.container}>
            <CardPicker callback={shuffleCards}/>
            <Deck list={list}/>
            <View style={styles.footer}>
              <Text>Created by: Alex Malotky</Text>
              <Button title="Github Repo" onPress={()=>Linking.openURL("https://github.com/Malotkya/Planechase")} />
              <Button title="My Other Work" onPress={()=>Linking.openURL("https://alex.malotky.net/Portfolio")} />
            </View>
            <StatusBar style="dark"/>
        </View>
    );
}
