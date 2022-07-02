import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Platform, ScrollView } from 'react-native';
import { colors } from './src/constants'
import Keyboard from './src/components/Keyboard'

export default function App() {

  const word = "alang";
  const letters = word.split('');

  const rows = new Array(letters.length < 6 ? letters.length : 6).fill(
    new Array(letters.length).fill("a")
  );

  const onKeyPressed = (key) => {
    console.warn(key);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Text style={styles.title}>WORDROP</Text>

      <ScrollView style={styles.map}>
        {rows.map((row,i) => (
          <View style={styles.row} key={i}>
            {row.map((cell,j) => (
              <View style={styles.cell} key={j}>
                <Text style={styles.cellText}>{cell.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        ))}

      </ScrollView>

      <Keyboard onKeyPressed={onKeyPressed} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
    paddingTop: Platform.OS === "android" ? 30 : 0
  },
  title: {
    color: colors.lightgrey,
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: 7,
    padding: 10,
    paddingBottom: 20
  },
  map: {
    alignSelf: "stretch",
    height: 100,
    margin: 5,
  },
  row: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "center",
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    margin: 3,
    borderColor: colors.darkgrey,
    borderWidth: 3,
    maxWidth: 65,
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: {
    color: colors.lightgrey,
    fontWeight: "bold",
    fontSize: 28,
  }
});
