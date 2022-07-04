import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { colors} from './src/constants'
import Game from './src/components/Game';

export default function App() {

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>WORDROP</Text>
      <Game />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 75,
  },
  title: {
    color: colors.lightgrey,
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: 7,
    padding: 10,
  },
});
