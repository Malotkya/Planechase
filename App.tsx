/** /App
 * 
 * @author Alex Malotky
 */
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react'
import { View, Linking, Text, Button, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as Device from 'expo-device'

import { INVERTSE_RATIO, MAX_SIZE, BUTTON_WIDTH, BUTTON_HEIGHT } from './src/Constants';
import { fontSize } from './src/Util';
import Planechase from './src/Planechase';
import Bounty from './src/Bounty';

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
    const [current, setCurrent] = useState("0");
    const {height, width} = useWindowDimensions();
    const [size, setSize] = useState(width);

    const PLANECHASE = <Planechase size={size} init={allCards.Planechase} />
    const BOUNTY = <Bounty size={size} init={allCards.Bounty} />
    //const UNKNOWN = <Unknown size={size} init={allCards.Unknown} />

    const getCurrent = ():React.JSX.Element => {
        switch (current) {
            case "0":
                return PLANECHASE;

            case "1":
                return BOUNTY;
        }

        return <Text>Error</Text> //UNKNOWN;
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: 'black',
            alignItems: 'center',
            justifyContent: 'center'
        },
        header: {
            paddingLeft: BUTTON_WIDTH,
            width: size,
            display: "flex",
            justifyContent: "space-around",
            flexDirection: "row",
            marginBottom: 5
        },
        title: {
            fontSize: fontSize(2, size),
            color: "white"
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

    /** Update Current Selected
     * 
     * Sets value in AsyncStorage
     * 
     * @param {string} value 
     * @param {number} index 
     */
    const updateCurrent = (value:string, index:number) => {
        AsyncStorage.setItem("current", value);
        setCurrent(value);
    }

    /** Remember Current Selected
     * 
     * Gets current from AsyncStorage on start.
     */
    useEffect(()=>{
        AsyncStorage.getItem("current").then((value)=>{
            if(value)
                setCurrent(value);
        })
    })

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
            <View style={styles.header}>
                <Text style={styles.title}>MTG Companion App</Text>
                <Picker selectedValue={current} onValueChange={updateCurrent}>
                    <Picker.Item label="Planechase" value="0"/>
                    <Picker.Item label="Bounty" value="1" />
                </Picker>
            </View>
            {getCurrent()}
            <StatusBar style="dark"/>
            <View style={styles.footer}>
                <Text style={{width: "100%", color: "white"}}>Created by: Alex Malotky</Text>
                <Button title="Github Repo" onPress={()=>Linking.openURL("https://github.com/Malotkya/Planechase")} />
                <Button title="My Other Work" onPress={()=>Linking.openURL("https://alex.malotky.net/Portfolio")} />
            </View>
        </View>
        
    )
}
