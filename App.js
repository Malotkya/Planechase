import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Linking, Text, Button } from 'react-native';

import Deck from "./src/Deck";
import list from "./cards.json";


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

const openLink = link => {

}

export default function App() {   
    return (
        <View style={styles.container}>
            <Deck list={list.Plane} />
            <View style={styles.footer}>
              <Text>Created by: Alex Malotky</Text>
              <Button title="Github Repo" onClick={()=>Linking.openURL("https://github.com/Malotkya/Planechase")} />
              <Button title="My Other Work" onClick={()=>Linking.openURL("https://alexmalotky.com/Portfolio")} />
            </View>
            <StatusBar style="dark"/>
        </View>
    );
}
