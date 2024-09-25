import {StyleSheet, View, TouchableOpacity, Text, GestureResponderEvent, Linking} from "react-native";
import { BUTTON_WIDTH, BUTTON_DEFAULT, BUTTON_HEIGHT } from "../Constants";
interface AsideProps {
    onNext: (e:GestureResponderEvent)=>void,
    onPrev: (e:GestureResponderEvent)=>void,
    onShuffle: (e:GestureResponderEvent)=>void,
    onShow: (e:GestureResponderEvent)=>void,
    horizontal: boolean
}

export default function Aside(props:AsideProps){
    const {onNext, onPrev, onShuffle, onShow, horizontal} = props;
    if(typeof onNext !== "function")
        throw new TypeError("onNext must be a function!");
    if(typeof onPrev !== "function")
        throw new TypeError("onPrev must be a function!");
    if(typeof onShuffle !== "function")
        throw new TypeError("onShuffle must be a function!");
    if(typeof onShow !== "function")
        throw new TypeError("onShow must be a function!");

    /** Aside Styling
     * 
     */
    const styles = StyleSheet.create({
        container: {
          width: horizontal? BUTTON_WIDTH: "100%",
          height: horizontal? "100%":  BUTTON_HEIGHT * 2,
          flexDirection: horizontal? "column": "row"
        },
        header: {
            flexGrow: 1,
            flexDirection: horizontal? "column": "row"
        },
        main: {
            flexGrow: 1,
            justifyContent: "center",
            flexDirection: horizontal? "column": "row"
        },
        footer: {
            flexGrow: 1,
            textAlign: "center",
            flexDirection: horizontal? "column": "row",
            flexWrap: horizontal? "nowrap": "wrap",
            justifyContent: horizontal? "flex-end": "center"
        },
        button: {
            ...BUTTON_DEFAULT,
            margin: 3
        },
        buttonWrapper: {
            width: horizontal? BUTTON_WIDTH: undefined,
            height: horizontal? undefined:  BUTTON_HEIGHT,
            flexDirection: horizontal? "column": "row",
            gap: 5,
            justifyContent: "center"
        },
        flowWrapper: {
            width: horizontal? BUTTON_WIDTH: "100%",
            height: horizontal? "100%":  BUTTON_HEIGHT,
            flexDirection: horizontal? "column": "row-reverse",
            justifyContent: "center"
        },
        footerText: {
            flexGrow: horizontal? undefined: 1,
            width: "100%",
            color: "white",
            textAlign: "center"
        },
        footerButton: {
            ...BUTTON_DEFAULT,
            height: horizontal? BUTTON_HEIGHT * 1.5: undefined,
            width: horizontal? undefined: BUTTON_WIDTH * 1.5,
            marginBottom: 5
        }
    });

    const showModalEvent = (e:GestureResponderEvent) => {
        e.stopPropagation();
        onShow(e);
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.buttonWrapper} >
                    <TouchableOpacity onPress={showModalEvent}>
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
                    Created by: {horizontal? "\n": ""} Alex Malotky
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