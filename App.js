/** /App
 * 
 * @author Alex Malotky
 */
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react'
import { StyleSheet, View, Linking, Text, Button, useWindowDimensions, Platform } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as Device from 'expo-device'

import CardPicker from "./src/Picker"
import Deck from "./src/Deck";
import { INVERTSE_RATIO, MAX_SIZE, BUTTON_WIDTH, BUTTON_HEIGHT } from './src/Constants';

import allCards from "./cards.json";

if(Platform.OS === "web")
    document.body.style.backgroundColor = "black";

//Check for Apple iOS and attempt to lock landscape.
switch(Device.osName){
    case "iOS":
    case "iPadOS":
        ScreenOrientation.unlockAsync()
            .then(forceLandscape)
            .catch(console.error);
        break;

    default: 
        forceLandscape();
}

/** Force Landscape on Phones and Tablets
 * 
 */
function forceLandscape() {
    switch(Device.deviceType){
        case Device.DeviceType.PHONE:
        case Device.DeviceType.TABLET:
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT)
                .catch((error)=>{
                    console.error(error);
                    alert("Try using the app in landscape mode!");
                });
            break;
    }
}

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
          paddingLeft: BUTTON_WIDTH,
          width: size,
          textAlign: "center",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-around",
        }
    });

    /** Shuffle Cards
     * 
     * @param {Array<Cards>} list 
     */
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

    /** Resize Effect
     * 
     */
    useEffect(()=>{
        const test = Math.ceil((height - (BUTTON_HEIGHT*1.5)) * INVERTSE_RATIO);
        if( test > (width-BUTTON_WIDTH)){
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
            <CardPicker callback={shuffleCards} size={size} init={allCards.Planechase}/>
            <Deck list={list} size={size} shuffle={()=>shuffleCards(list)}/>
            <View style={styles.footer}>
              <Text style={{width: "100%", color: "white"}}>Created by: Alex Malotky</Text>
              <Button title="Github Repo" onPress={()=>Linking.openURL("https://github.com/Malotkya/Planechase")} />
              <Button title="My Other Work" onPress={()=>Linking.openURL("https://alex.malotky.net/Portfolio")} />
            </View>
            <StatusBar style="dark"/>
        </View>
    );
}
