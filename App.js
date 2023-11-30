import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react'
import { StyleSheet, View, Linking, Text, Button, useWindowDimensions, Platform } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as Device from 'expo-device'

import CardPicker from "./src/Picker"
import Deck from "./src/Deck";
import { RATIO } from './src/Deck/Card';

export const INVERTSE_RATIO = 1 / RATIO;
const MAX_SIZE = 850;//px

switch(Device.deviceType){
    case Device.DeviceType.PHONE:
    case Device.DeviceType.TABLET:
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
}

if(Platform.OS === "web")
    document.body.style.backgroundColor = "black";

export default function App() {

    const [list, setList] = useState([]);
    const {height, width} = useWindowDimensions();
    const [size, setSize] = useState(width);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: 'black',
            alignItems: 'center',
            justifyContent: 'center'
        },
        footer: {
          paddingLeft: "100px",
          width: `${size}px`,
          textAlign: "center",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-around",
        }
    });

    const shuffleCards = list => {
        const newList = [];
        const input = JSON.parse(JSON.stringify(list));

        while(input.length > 0){
            let index = Math.floor(Math.random() * input.length);
            newList.push(input[index]);
            input.splice(index, 1);
        }

        setList(newList);
    }

    useEffect(()=>{
        const test = Math.floor(height * INVERTSE_RATIO);
        if( test > (width-100)){
            if(width < MAX_SIZE)
                setSize(width);
            else
                setSize(MAX_SIZE)
        } else {
            if(test < MAX_SIZE)
                setSize(test);
            else
                setSize(MAX_SIZE)
        }
    }, [height, width]);

    return (
        <View style={styles.container}>
            <CardPicker callback={shuffleCards} size={size}/>
            <Deck list={list} size={size}/>
            <View style={styles.footer}>
              <Text style={{width: "100%", color: "white"}}>Created by: Alex Malotky</Text>
              <Button title="Github Repo" onPress={()=>Linking.openURL("https://github.com/Malotkya/Planechase")} />
              <Button title="My Other Work" onPress={()=>Linking.openURL("https://alex.malotky.net/Portfolio")} />
            </View>
            <StatusBar style="dark"/>
        </View>
    );
}
