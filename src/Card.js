import {StyleSheet, Image, Text, View} from 'react-native';

const styles = StyleSheet.create({
    view: {
        width: '80%'
    },
    figure: {
        width: 100,
        height: 150,
    },
    name: {
        borderBottomColor: "black",
        borderBottomWidth: 1
    },
    image: {
        width: '100%',
        height: '100%',
        transform: 'rotate(90deg)',
        resizeMode: 'cover'
    }
});

const Card = props => {
    return (
        <View style={styles.view}>
            <Text style={styles.name}>{props.card.name}</Text>
            <Text>{props.card.text}</Text>
            <View style={styles.figure}>
                <Image style={styles.image} source={{uri:props.card.image_uri}} />
            </View>
        </View>
    )
};

export default Card;