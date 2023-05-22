import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Image goes here.</Text>
      <Image
        style={imageStyles}
        source={{uri: 'https://cards.scryfall.io/normal/front/4/2/42ecb371-53aa-4368-8ddd-88ae8e90ae0c.jpg'}}
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
