import { Dispatch } from "react";
import {StyleSheet, View, TouchableOpacity, Text, GestureResponderEvent, Linking} from "react-native";
import { BUTTON_WIDTH, BUTTON_DEFAULT, BUTTON_HEIGHT } from "../Constants";

interface AsideProps {
    onNext: (e:GestureResponderEvent)=>void,
    onPrev: (e:GestureResponderEvent)=>void,
    onShuffle: (e:GestureResponderEvent)=>void,
    state: AppState,
    dispatch: Dispatch<AppAction>
}

export default function Aside({onNext, onPrev, onShuffle, state, dispatch}:AsideProps){

    /** Aside Styling
     * 
     */
    const styles = StyleSheet.create({
        container: {
          width: state.direction? BUTTON_WIDTH: "100%",
          height: state.direction? "100%":  BUTTON_HEIGHT * 2,
          flexDirection: state.direction? "column": "row"
        },
        header: {
            flexGrow: 1,
            flexDirection: state.direction? "column": "row"
        },
        main: {
            flexGrow: 1,
            justifyContent: "center",
            flexDirection: state.direction? "column": "row"
        },
        footer: {
            flexGrow: 1,
            textAlign: "center",
            flexDirection: state.direction? "column": "row",
            flexWrap: state.direction? "nowrap": "wrap",
            justifyContent: state.direction? "flex-end": "center"
        },
        button: {
            ...BUTTON_DEFAULT,
            margin: 3
        },
        buttonWrapper: {
            width: state.direction? BUTTON_WIDTH: undefined,
            height: state.direction? undefined:  BUTTON_HEIGHT,
            flexDirection: state.direction? "column": "row",
            gap: 5,
            justifyContent: "center"
        },
        flowWrapper: {
            width: state.direction? BUTTON_WIDTH: "100%",
            height: state.direction? "100%":  BUTTON_HEIGHT,
            flexDirection: state.direction? "column": "row-reverse",
            justifyContent: "center"
        },
        footerText: {
            flexGrow: state.direction? undefined: 1,
            width: "100%",
            color: "white",
            textAlign: "center"
        },
        footerButton: {
            ...BUTTON_DEFAULT,
            height: state.direction? BUTTON_HEIGHT * 1.5: undefined,
            width: state.direction? undefined: BUTTON_WIDTH * 1.5,
            marginBottom: 5
        }
    });

    const showSelectModal = (e:GestureResponderEvent) => {
        e.stopPropagation();
        dispatch({type:ActionType.FLIP_SELECT_MODAL});
    }

    const showAboutModal = (e:GestureResponderEvent) => {
        e.stopPropagation();
        dispatch({type:ActionType.SHOW_ABOUT_MODAL});
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.buttonWrapper} >
                    <TouchableOpacity onPress={showSelectModal}>
                        <Text style={styles.button}>Card List</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.main}>
                <View style={styles.flowWrapper} >
                    <TouchableOpacity onPress={onNext}>
                        <Text style={styles.button}>Next</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={onShuffle}>
                        <Text style={styles.button}>Shuffle</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onPrev}>
                        <Text style={styles.button}>Previous</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Created by: {state.direction? "\n": ""} Alex Malotky
                </Text>
                <View style={styles.buttonWrapper} >
                    <TouchableOpacity onPress={()=>Linking.openURL("https://github.com/Malotkya/Planechase")}>
                        <Text style={styles.footerButton}>Github Repo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>Linking.openURL("https://alex.malotky.net/Portfolio")}>
                        <Text style={styles.footerButton}>My Other Work</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}