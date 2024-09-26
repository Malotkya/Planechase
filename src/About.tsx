import { Dispatch } from "react";
import {StyleSheet, Modal, Linking, TouchableOpacity, Text, View, useWindowDimensions, Button} from "react-native";
import { BUTTON_DEFAULT, RATIO } from "./Constants";
import { fontSize } from "./Util";

interface AboutProps {
    state: AppState
    dispatch:Dispatch<AppAction>
}

export default function About({dispatch, state}:AboutProps){
    const {height} = useWindowDimensions();
    const SIZE = state.size * RATIO;

    const styles = StyleSheet.create({
        wrapper: {
            width: "80%",
            height: SIZE,
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: Math.floor( (height - SIZE) / 2 ),
            display: "flex",
            flexDirection: "column",
            backgroundColor: "black",
            cursor: "auto"
        },
        header: {
            display: "flex",
            flexDirection: "row",
            marginBottom: 10,
        },
        title: {
            flexGrow: 1,
            textAlign: "center",
            color: "white",
            fontSize: fontSize(2, state.size)
        },
        text: {
            color: "white",
            textAlign: "center"
        },
        button: {
            ...BUTTON_DEFAULT
        },
        buttonWrapper: {
            flexDirection: "row",
            justifyContent: "space-around"
        }
    });

    const close = () =>{
        dispatch({type:"HIDE_ABOUT_MODAL"});
    }

    return (
        <Modal visible={state.aboutModal} presentationStyle={"formSheet"} onRequestClose={close} transparent={true}>
            <TouchableOpacity activeOpacity={1} onPress={(e)=>e.stopPropagation()} style={styles.wrapper}>
                <View style={styles.header}>
                    <Text style={styles.title}>
                        About
                    </Text>
                    <TouchableOpacity onPress={close}>
                        <Text style={styles.button}>X</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.text}>
                    Created by: Alex Malotky
                </Text>
                <View style={styles.buttonWrapper}>
                    <Button onPress={()=>Linking.openURL("https://github.com/Malotkya/Planechase")} title={"Github Repo"} />
                    <Button onPress={()=>Linking.openURL("https://alex.malotky.net/Portfolio")} title={"My Other Work"} />
                </View>
            </TouchableOpacity>
        </Modal>
    )
}