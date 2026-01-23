/** /App
 * 
 * @author Alex Malotky
 */
import { StatusBar } from 'expo-status-bar';
import { useReducer, useEffect } from 'react'
import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { INVERTSE_RATIO, MAX_SIZE, BUTTON_WIDTH, BUTTON_HEIGHT} from './src/Constants';
import { fontSize } from './src/Util';
import { updateState } from './src/State';
import { preLoadSettings, initalLoadData } from './src/Load';
import Main from './src/Main';
import About from './src/About';

preLoadSettings();

export default function App() {
    const {height, width} = useWindowDimensions();
    const [state, dispatch] = useReducer<AppState, [AppAction]>(updateState, {size:width} as any)

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: 'black',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: "auto"
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
    const updateCurrent = (value:number) => {
        dispatch({type:"UPDATE_CURRENT", value: Number(value)});
    }

    /** Remember Current Selected
     * 
     * Gets current from AsyncStorage on start.
     */
    useEffect(()=>{
        initalLoadData(dispatch, width)
    }, [])

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
            dispatch({type:"DISPLAY_VERTICAL", value:testWidth});
        } else if(testHeight < testWidth){
            dispatch({type:"DISPLAY_HORIZONTAL", value:testHeight});
        } else {
            if(height > width){
                dispatch({type:"DISPLAY_VERTICAL", value:testWidth});
            } else {
                dispatch({type:"DISPLAY_HORIZONTAL", value:testHeight});
            }
        }

    }, [height, width]);

    return typeof state.current === "number" ? (
        <TouchableOpacity style={styles.container} activeOpacity={1} onPress={()=>dispatch({type:"CLOSE_ALL_MODALS"})}>
            <View style={styles.header}>
                <Text style={styles.title}>MTG Companion App</Text>
                <Picker selectedValue={state.current} onValueChange={updateCurrent}>
                    <Picker.Item label="Planechase" value="0"/>
                    <Picker.Item label="Bounty" value="1" />
                </Picker>
            </View>
            <Main state={state} dispatch={dispatch} />
            <StatusBar style="dark"/>
            <About dispatch={dispatch} state={state} />
        </TouchableOpacity>
    ): undefined
}
