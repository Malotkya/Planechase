/** /src/Deck/Card
 * 
 * @author Alex Malotky
 */
import {useState, useEffect} from 'react';
import {StyleSheet, Image, Text, TouchableOpacity } from 'react-native';

import { RATIO } from '../Constants';
const OFFSET = -2;

interface cardProps {
    card:CardBase
    size:number
}

export default function Card(props:cardProps){
    const {card = {}, size} = props;
    if(typeof size !== "number")
        throw new TypeError("Size must be a number!");

    const [visible, setVisible] = useState(true);
    
    const width = props.size;
    const height = Math.ceil(props.size * RATIO);
    const {
        name = "undefined",
        type = "undefined",
        text = "undefined",
        image_uri = ""
    } = card as CardBase;

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
            display: visible? undefined/*"Block"*/: "none"
        }
    });

    const flip = () =>{
        setVisible(!visible);
    }

    useEffect(()=>{
        setVisible(true)
    }, [props.card])

    return (
        <TouchableOpacity  style={styles.view} onPress={flip}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.type}>{type}</Text>
            <Text style={styles.text}>{text.replace("\n", "\n\n")}</Text>
            <Image style={styles.image} source={{uri:image_uri}} />
        </TouchableOpacity >
    )
};