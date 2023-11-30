import { StatusBar } from 'expo-status-bar';
import { useState } from 'react'
import { StyleSheet, View, Linking, Text, Button, Platform } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';

import CardPicker from "./src/Picker"
import Deck from "./src/Deck";

switch(Platform.OS){
    case "ios":
    case "android":
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    footer: {
      paddingLeft: "100px",
      width: '500px',
      textAlign: "center",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-around"
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
              <Text style={{width: "100%"}}>Created by: Alex Malotky</Text>
              <Button title="Github Repo" onPress={()=>Linking.openURL("https://github.com/Malotkya/Planechase")} />
              <Button title="My Other Work" onPress={()=>Linking.openURL("https://alex.malotky.net/Portfolio")} />
            </View>
            <StatusBar style="dark"/>
        </View>
    );
}
