/** /App
 * 
 * @author Alex Malotky
 */
import { StatusBar } from 'expo-status-bar';
import { useReducer, useEffect } from 'react'
import { View, Text, StyleSheet, useWindowDimensions, Platform, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as Device from 'expo-device'

import { INVERTSE_RATIO, MAX_SIZE, BUTTON_WIDTH, BUTTON_HEIGHT} from './src/Constants';
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

/** Update App State Reducer
 * 
 * @param {AppState} state 
 * @param {AppAction} action 
 * @returns {AppState}
 */
function updateState(state:AppState, action:AppAction):AppState{
    switch(action.type){
        case ActionType.SHOW_SELECT_MODAL:
            state.selectModal = true;
            state.aboutModal = false;
            return state;

        case ActionType.HIDE_SELECT_MODAL:
            state.selectModal = false;
            state.aboutModal = false;
            return state;

        case ActionType.FLIP_SELECT_MODAL:
            state.selectModal = !state.selectModal;
            state.aboutModal = false;
            return state;

        case ActionType.SHOW_ABOUT_MODAL:
            state.aboutModal = true;
            state.selectModal = false;
            return state;
    
        case ActionType.HIDE_ABOUT_MODAL:
            state.aboutModal = false;
            state.selectModal = false;
            return state;
    
        case ActionType.FLIP_ABOUT_MODAL:
            state.aboutModal = !state.aboutModal;
            state.selectModal = false;
            return state;

        case ActionType.CLOSE_ALL_MODALS:
            state.aboutModal = false;
            state.selectModal = false;
            return state;

        case ActionType.DISPLAY_HORIZONTAL:
            state.direction = true;
            if(action.value)
                state.size = action.value;
            return state;

        case ActionType.DISPLAY_VERTICAL:
            state.direction = false;
            if(action.value)
                state.size = action.value;
            return state;

        case ActionType.UPDATE_SIZE:
            if(typeof action.value === "undefined")
                throw new TypeError("Need value to update Size!");
            state.size = action.value;
            return state;

        case ActionType.UPDATE_CURRENT:
            if(typeof action.value === "undefined")
                throw new TypeError("Need value to update Current!");
            state.current = action.value;
            return state;
    }

    throw new Error(`Unknow Action type: ${action.type}`);
}

export default function App() {
    const {height, width} = useWindowDimensions();
    const [state, dispatch] = useReducer(updateState, {
        current: 0,
        size: width,
        direction: false, 
        selectModal: false,
        aboutModal: false
    })

    const PLANECHASE = <Planechase init={allCards.Planechase} state={state} dispatch={dispatch} />
    const BOUNTY     = <Bounty     init={allCards.Bounty}     state={state} dispatch={dispatch}/>

    const getCurrent = ():React.JSX.Element => {
        switch (state.current) {
            case 0:
                return PLANECHASE;

            case 1:
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
            paddingLeft: state.direction? BUTTON_WIDTH: 0,
            width: state.size,
            display: "flex",
            justifyContent: "space-around",
            flexDirection: "row",
            marginBottom: 5
        },
        title: {
            fontSize: fontSize(2, state.size),
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
        dispatch({type:ActionType.UPDATE_CURRENT, value: Number(value)});
    }

    /** Remember Current Selected
     * 
     * Gets current from AsyncStorage on start.
     */
    useEffect(()=>{
        AsyncStorage.getItem("current").then((value)=>{
            if(value)
                dispatch({type:ActionType.UPDATE_CURRENT, value: Number(value)});
        })
    })

    /** Resize Effect
     * 
     */
    useEffect(()=>{
        const testHeight = Math.min(
            Math.ceil((height - (2 *BUTTON_HEIGHT) - 14) * INVERTSE_RATIO),
            MAX_SIZE
        );
        const testWidth = Math.min(
            width - BUTTON_WIDTH,
            MAX_SIZE
        );

        if( testHeight > testWidth){
            dispatch({type:ActionType.DISPLAY_VERTICAL, value:testWidth});
        } else if(testHeight < testWidth){
            dispatch({type:ActionType.DISPLAY_HORIZONTAL, value:testHeight});
        } else {
            if(height > width){
                dispatch({type:ActionType.DISPLAY_VERTICAL, value:testWidth});
            } else {
                dispatch({type:ActionType.DISPLAY_HORIZONTAL, value:testHeight});
            }
        }

    }, [height, width]);

    return (
        <TouchableOpacity style={styles.container} onPress={()=>dispatch({type:ActionType.CLOSE_ALL_MODALS})}>
            <View style={styles.header}>
                <Text style={styles.title}>MTG Companion App</Text>
                <Picker selectedValue={state.current.toString()} onValueChange={updateCurrent}>
                    <Picker.Item label="Planechase" value="0"/>
                    <Picker.Item label="Bounty" value="1" />
                </Picker>
            </View>
            {getCurrent()}
            <StatusBar style="dark"/>
        </TouchableOpacity>
        
    )
}
