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
    card:CardBase|undefined
    size:number
    horizontal:boolean
}

const WARNING = "Select Cards To Use%nFrom List";

export default function Card({card, size, horizontal = true}:cardProps){
    const [visible, setVisible] = useState(true);
    
    //Calculate Dimensions
    const width  = horizontal? size
                             : Math.ceil(size / 2);
    const height = horizontal? Math.ceil(size * RATIO)
                             : Math.ceil(width * INVERTSE_RATIO);

    /** Card Styling
     * 
     */
    const styles = StyleSheet.create({
        view: {
            width: width,
            height: height,
            borderStyle: "solid",
            borderWidth: 2,
            borderRadius: horizontal? 15: 8,
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
        },
        emptyWarning: {
            color: "red",
            textAlign: "center",
            fontSize: fontSize(2.5, size),
            fontWeight: "bold",
            marginTop: fontSize(1, size)
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
    }, [card])

    return (
        <TouchableOpacity  style={styles.view} onPress={flip}>
            { card ? (<>
                    <Text style={styles.name}>{card.name}</Text>
                    <Text style={styles.type}>{card.type}</Text>
                    <Text style={styles.text}>{card.text.replace(/\n(?!\d)/g, "\n\n")}</Text>
                    <Image style={styles.image} source={{uri:card.image_uri}} />
                </>)
                : <Text style={styles.emptyWarning}>{
                    width < fontSize(WARNING.length * INVERTSE_RATIO, size)
                        ? WARNING.replaceAll(/%n/g, '\n')
                        : WARNING.replaceAll(/%n/g, ' ')
                }</Text>    
            }
            
        </TouchableOpacity >
    )
};