import {useState, useEffect} from 'react';
import {StyleSheet, Image, Text, View} from 'react-native';

export const RATIO = 0.69841;
const OFFSET = -2;

export default function Card(props){

    const [visible, setVisible] = useState(true);
    const height = Math.ceil(props.size * RATIO);
    const width = props.size;

    const styles = StyleSheet.create({
        view: {
            width: width,
            height: height,
            borderStyle: "solid",
            borderWidth: 2,
            borderRadius: 15,
            borderColor: "black",
            overflow: "hidden",
            backgroundColor: "white"
        },
        name: {
            textAlign: "center"
        },
        type: {
            textAlign: "center",
            borderBottomColor: "black",
            borderBottomWidth: 1
        },
        text: {
            padding: 5
        },
        image: {
            position: 'absolute',
            left: width+OFFSET,
            top: OFFSET,
            transformOrigin: 'top left',
            transform: [{rotate: '90deg'}],
            width: height,
            height: width,
            display: visible? "block": "none"
        }
    });

    const flip = () =>{
        setVisible(!visible);
    }

    useEffect(()=>{
        setVisible(true)
    }, [props.card])

    const value = props.card || {
        name: "undefined",
        type: "undefined",
        text: "undefined",
        image_uri: ""
    };

    return (
        <View style={styles.view} onClick={flip}>
            <Text style={styles.name}>{value.name}</Text>
            <Text style={styles.type}>{value.type}</Text>
            <Text style={styles.text}>{value.text.replace("\n", "\n\n")}</Text>
            <Image style={styles.image} source={{uri:value.image_uri}} />
        </View>
    )
};