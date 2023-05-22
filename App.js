import {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Button } from 'react-native';
import Card from "./src/Card";
import list from "./cards.json";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 100,
    height: 50
  }
});

export default function App() {
  const [card, setCard] = useState(list[0]);
  const randomIndex = () => {
    return Math.floor(Math.random() * list.length);
  };

  const randomCard = () => {
    setCard(list[randomIndex()]);
  }

  useEffect(()=>{
    randomCard();
  }, [])
  return (
    <View style={styles.container}>
      <Button style={styles.button} onPress={randomCard}>Planeswalk</Button>
      <Card card={card} />
      <StatusBar />
    </View>
  );
}
