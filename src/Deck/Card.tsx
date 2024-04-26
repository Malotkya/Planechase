/** /src/Deck/Card
 * 
 * @author Alex Malotky
 */
import {useState, useEffect} from 'react';
import {StyleSheet, Image, Text, TouchableOpacity } from 'react-native';

import { INVERTSE_RATIO, RATIO } from '../Constants';
import { fontSize } from '../Util';
const OFFSET = -2;

interface cardProps {
    card:CardBase
    size:number
    horizontal:boolean
}

export default function Card(props:cardProps){
    //Validate props
    const {card = {}, size, horizontal = true} = props;
    if(typeof size !== "number")
        throw new TypeError("Size must be a number!");

    const [visible, setVisible] = useState(true);
    
    //Calculate Dimensions
    const width  = horizontal? size
                             : Math.ceil(size / 2);
    const height = horizontal? Math.ceil(size * RATIO)
                             : Math.ceil(width * INVERTSE_RATIO)

    //Validate Card
    const {
        name = "undefined",
        type = "undefined",
        text = "undefined",
        image_uri = ""
    } = card as CardBase;

    /** Card Styling
     * 
     */
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
            padding: 5,
            fontSize: horizontal? 14: fontSize(1.2, size)
        },
        image: {
            position: 'absolute',
            left: horizontal? width+OFFSET: OFFSET,
            top: OFFSET,
            transformOrigin: 'top left',
            transform: horizontal? [{rotate: '90deg'}]: undefined,
            width: horizontal? height: width,
            height: horizontal? width: height,
            display: visible? undefined/*"Block"*/: "none"
        }
    });

    /** Flip Visibility
     * 
     */
    const flip = () =>{
        setVisible(!visible);
    }

    /** Reset Visibility if Card Changes
     * 
     */
    useEffect(()=>{
        setVisible(true)
    }, [props.card])

    return (
        <TouchableOpacity  style={styles.view} onPress={flip}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.type}>{type}</Text>
            <Text style={styles.text}>{text.replace(/\n(?!\d)/g, "\n\n")}</Text>
            <Image style={styles.image} source={{uri:image_uri}} />
        </TouchableOpacity >
    )
};