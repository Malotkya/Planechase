import { Dispatch } from "react";
import {StyleSheet, View, TouchableOpacity, Text, GestureResponderEvent, useWindowDimensions, ViewStyle} from "react-native";
import { BUTTON_WIDTH, BUTTON_DEFAULT, BUTTON_HEIGHT } from "../Constants";

interface AsideProps {
    onNext: (e:GestureResponderEvent)=>void,
    onPrev: (e:GestureResponderEvent)=>void,
    onShuffle: (e:GestureResponderEvent)=>void,
    state: AppState,
    dispatch: Dispatch<AppAction>
}

export default function Aside({onNext, onPrev, onShuffle, state, dispatch}:AsideProps){
    const {width} = useWindowDimensions();

    /** Aside Styling
     * 
     */
    const styles = StyleSheet.create({
        container: {
            width: state.direction? BUTTON_WIDTH: "100%",
            height: state.direction? "100%":  BUTTON_HEIGHT,
            flexDirection: state.direction? "column": "row",
            gap: 5
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
            ...BUTTON_DEFAULT
        },
        buttonWrapper: {
            width: state.direction? BUTTON_WIDTH: undefined,
            height: state.direction? undefined:  BUTTON_HEIGHT,
            flexDirection: state.direction? "column": "row",
            gap: 5,
            justifyContent: "center"
        }
    });

    const flowStyling = ():ViewStyle => {
        if(state.direction){
            return {
                width: BUTTON_WIDTH,
                height: "100%",
                flexDirection: "column",
                justifyContent: "center",
                gap: 5
            }
        } else if(width > 520){
            return {
                width: "100%",
                height:  BUTTON_HEIGHT,
                flexDirection: "row-reverse",
                justifyContent: "center",
                gap: 3
            }
        } else {
            return {
                width: BUTTON_WIDTH,
                height: "100%",
                flexDirection: "column",
                justifyContent: "flex-start"
            }
        }
    }

    const showSelectModal = (e:GestureResponderEvent) => {
        e.stopPropagation();
        dispatch({type:"FLIP_SELECT_MODAL"});
    }

    const showAboutModal = (e:GestureResponderEvent) => {
        e.stopPropagation();
        dispatch({type:"SHOW_ABOUT_MODAL"});
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
                <View style={flowStyling()} >
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
            <View style={styles.buttonWrapper} >
                    <TouchableOpacity onPress={showAboutModal}>
                        <Text style={styles.button}>About</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}