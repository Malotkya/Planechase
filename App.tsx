/** /App
 * 
 * @author Alex Malotky
 */
import { StatusBar } from 'expo-status-bar';
import { useReducer, useEffect } from 'react'
import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { BUTTON_WIDTH} from './src/Constants';
import { useScreenOrientation } from "@use-expo/screen-orientation";
import { fontSize } from './src/Util';
import { updateState } from './src/State';
import { preLoadSettings, initalLoadData } from './src/Load';
import Main from './src/Main';
import About from './src/About';
import { getTestOrientation, shouldRotate } from './src/Rotation';

preLoadSettings();

export default function App() {
    const {height, width} = useWindowDimensions();
    const [orientation] = useScreenOrientation();
    const [state, dispatch] = useReducer<AppState, [AppAction]>(updateState, {size:width} as any)

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: 'black',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: "auto",
            transform: state.rotate? "rotate(90deg)": undefined
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
        initalLoadData((action)=>{

            //Intercept Init Dispatch and set Rotation.
            if(action.state) {

            }

            dispatch(action)
        }, width)
    }, [])

    /** Resize Effect
     * 
     */
    useEffect(()=>{
        const [testWidth, testHeight] = getTestOrientation(width, height, state.rotate);
        const rotate =  shouldRotate();

        if( testHeight > testWidth){
            dispatch({type:"DISPLAY_VERTICAL", value:[testWidth, rotate]});
        } else if(testHeight < testWidth){
            dispatch({type:"DISPLAY_HORIZONTAL", value:[testHeight, rotate]});
        } else {
            if(height > width){
                dispatch({type:"DISPLAY_VERTICAL", value:[testWidth, rotate]});
            } else {
                dispatch({type:"DISPLAY_HORIZONTAL", value:[testHeight, rotate]});
            }
        }

    }, [height, width, orientation]);

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
