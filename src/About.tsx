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
    const INVERSE = state.size * RATIO;

    const styles = StyleSheet.create({
        wrapper: {
            width: state.size,
            height: INVERSE,
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: Math.floor( (height - INVERSE) / 2 ),
            display: "flex",
            flexDirection: "column",
            backgroundColor: "black",
            cursor: "auto",
            borderColor: "white",
            borderStyle: "solid",
            borderWidth: 3,
            borderRadius: 10
        },
        header: {
            display: "flex",
            flexDirection: "row",
            marginBottom: 10,
            borderBottomColor: "white",
            borderBottomWidth: 3,
            padding: 5
        },
        title: {
            flexGrow: 1,
            textAlign: "center",
            color: "white",
            fontSize: fontSize(2.5, state.size)
        },
        paragraph: {
            flexGrow: 1,
            color: "white",
            padding: 5
        },
        text: {
            color: "white",
            textAlign: "center",
            padding: 5
        },
        button: {
            fontSize: fontSize(2.5, state.size),
            color: "white",
            marginRight: 10

        },
        buttonWrapper: {
            flexDirection: "row",
            justifyContent: "space-around",
            marginBottom: 5
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
                <Text style={styles.paragraph}>
                    This app was created to experiment working with React Native.
                </Text>
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