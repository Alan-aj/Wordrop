import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Platform, ScrollView } from 'react-native';
import { colors, CLEAR, ENTER } from './src/constants'
import Keyboard from './src/components/Keyboard'

const NUMBER_OF_TRIES = 6;
const copyArray = (arr) => {
  return [...arr.map((rows) => [...rows])]
}

export default function App() {

  const word = "hello";
  const letters = word.split('');

  const [rows, setRows] = useState(
    new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(""))
  );
  const [curRow, setCurRow] = useState(0);
  const [curCol, setCurCol] = useState(0);

  const onKeyPressed = (key) => {
    const updateRows = copyArray(rows);

    if (key === CLEAR) {
      const prevCol = curCol - 1;
      if (prevCol >= 0) {
        updateRows[curRow][prevCol] = "";
        setRows(updateRows);
        setCurCol(prevCol);
      }
      return;
    }
    if (key === ENTER) {
      if (curCol === rows[0].length) {
        setCurRow(curRow + 1)
        setCurCol(0)
      }
      return;
    }

    if (curCol < rows[0].length) {
      updateRows[curRow][curCol] = key;
      setRows(updateRows);
      setCurCol(curCol + 1);
    }
  }
  const isCellActive = (row, col) => {
    return row == curRow && col == curCol;
  }

  const getCellColor = (letter, row, col) => {
    if (row >= curRow) {
      return colors.black;
    }
    if (letter === letters[col]) {
      return colors.primary;
    }
    if (letters.includes(letter)) {
      return colors.secondary;
    }
    return colors.darkgrey;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Text style={styles.title}>WORDROP</Text>

      <ScrollView style={styles.map}>
        {rows.map((row, i) => (
          <View style={styles.row} key={`row-${i}`}>
            {row.map((cell, j) => (
              <View
                style={[
                  styles.cell,
                  {
                    borderColor: isCellActive(i, j) ? colors.lightgrey : colors.darkgrey,
                    backgroundColor: getCellColor(cell, i, j),
                  }
                ]}
                key={`cell-${i}-${j}`}>
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
