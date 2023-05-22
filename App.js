import {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Button } from 'react-native';
import Card from "./src/Card";
import RandomArray from './src/RandomArray';
import list from "./cards.json";

const array = new RandomArray(list);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 100,
    height: 100
  }
});

export default function App() {
  const [card, setCard] = useState(array.next());

  const randomCard = () => {
    setCard(array.next());
  }
  
  return (
    <View style={styles.container}>
      <Button style={styles.button} onPress={randomCard}>Planeswalk</Button>
      <Card card={card} />
      <StatusBar />
    </View>
  );
}
