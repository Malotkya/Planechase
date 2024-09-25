/** /App
 * 
 * @author Alex Malotky
 */
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react'
import { View, Linking, Text, Button, StyleSheet, useWindowDimensions, Platform, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as Device from 'expo-device'

import { INVERTSE_RATIO, MAX_SIZE, BUTTON_WIDTH, BUTTON_HEIGHT, RATIO, BUTTON_DEFAULT } from './src/Constants';
import { fontSize } from './src/Util';
import Planechase from './src/Planechase';
import Bounty from './src/Bounty';

import allCards from "./cards.json";


//Platform Specific Settings
if(Platform.OS === "web") {
    document.body.style.backgroundColor = "black";
} else if (Device.osName === "iOS" || Device.osName === "iPadOS") {
    ScreenOrientation.unlockAsync()
            .then(forceLandscape)
            .catch(console.error);
} else {
    forceLandscape();
}

/** Force Landscape on Phones and Tablets
 * 
 */
async function forceLandscape() {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
}

export default function App() {
    const [current, setCurrent] = useState("0");
    const {height, width} = useWindowDimensions();
    const [size, setSize] = useState(width);
    const [horizontal, setHorizontal] = useState(false); //true = horizontal

    const PLANECHASE = <Planechase size={size} init={allCards.Planechase} horizontal={horizontal}/>
    const BOUNTY = <Bounty size={size} init={allCards.Bounty} horizontal={horizontal}/>

    const getCurrent = ():React.JSX.Element => {
        switch (current) {
            case "0":
                return PLANECHASE;

            case "1":
                return BOUNTY;
        }

        return <Text>Error: Invalid Current Selection</Text>;
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
        const test = Math.ceil((height - BUTTON_HEIGHT) * INVERTSE_RATIO);
        if( test > (width-BUTTON_WIDTH)){
            setHorizontal(false)
            if(width < MAX_SIZE)
                setSize(width);
            else
                setSize(MAX_SIZE)
        } else {
            setHorizontal(true);
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
        </View>
        
    )
}
