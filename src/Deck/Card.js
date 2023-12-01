/** /src/Deck/Card
 * 
 * @author Alex Malotky
 */
import {useState, useEffect} from 'react';
import {StyleSheet, Image, Text, View} from 'react-native';

import { RATIO } from '../Constants';
const OFFSET = -2;

export default function Card(props){

    const [visible, setVisible] = useState(true);

    if(typeof props.size !== "number")
        throw new TypeError("Need to know the size of the card!");
    
    const width = props.size;
    const height = Math.ceil(props.size * RATIO);

    const {
        name = "undefined",
        type = "undefined",
        text = "undefined",
        image_uri = ""
    } = props.card || {};

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

    return (
        <View style={styles.view} onClick={flip}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.type}>{type}</Text>
            <Text style={styles.text}>{text.replace("\n", "\n\n")}</Text>
            <Image style={styles.image} source={{uri:image_uri}} />
        </View>
    )
};