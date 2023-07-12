import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Linking, Text, Button } from 'react-native';

import Deck from "./src/Deck";
import CardList from "./src/CardList"

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    footer: {
      width: '100%',
      textAlign: "center"
    }
});

export default function App() {
    const list = [];

    return (
        <View style={styles.container}>
            <CardList list={list} />
            <Deck list={list} />
            <View style={styles.footer}>
              <Text>Created by: Alex Malotky</Text>
              <Button title="Github Repo" onClick={()=>Linking.openURL("https://github.com/Malotkya/Planechase")} />
              <Button title="My Other Work" onClick={()=>Linking.openURL("https://alexmalotky.com/Portfolio")} />
            </View>
            <StatusBar style="dark"/>
        </View>
    );
}
