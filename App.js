import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import list from "./cards.json";

console.log(list);

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Image goes here.</Text>
      <Image
        style={imageStyles}
        source={{uri: list[0].image_uri}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const imageStyles = {
  transform: 'rotate(90deg)',
  width: 100,
  height: 150
}
