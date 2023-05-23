import {useState} from 'react';
import {StyleSheet, Image, Text, View} from 'react-native';

const RATIO = 0.69841;
const OFFSET = -2;

const Card = props => {

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
            overflow: "hidden"
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

    return (
        <View style={styles.view} onClick={flip}>
            <Text style={styles.name}>{props.card.name}</Text>
            <Text style={styles.type}>{props.card.type}</Text>
            <Text style={styles.text}>{props.card.text}</Text>
            <Image style={styles.image} source={{uri:props.card.image_uri}} />
        </View>
    )
};

export default Card;