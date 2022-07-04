import { useEffect, useState } from 'react';
import { Text, View, ScrollView, Alert } from 'react-native';
import { colors, CLEAR, ENTER } from '../../constants'
import Keyboard from '../Keyboard'
import words from '../../words';
import styles from "./Game.styles";
import { copyArray } from '../../Utils';

const NUMBER_OF_TRIES = 6;

const Game = () => {

    const word = words[1];
    const letters = word.split('');

    const [rows, setRows] = useState(
        new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(""))
    );
    const [curRow, setCurRow] = useState(0);
    const [curCol, setCurCol] = useState(0);
    const [gameState, setGameState] = useState("playing"); // won,lost,playing

    useEffect(() => {
        if (curRow > 0) {
            checkGameState();
        }
    }, [curRow])

    const checkGameState = () => {
        if (checkIfWon() && gameState !== "won") {
            Alert.alert("Hurraay", "You won!");
            setGameState("won");
        } else if (checkIfLost() && gameState !== "lost") {
            Alert.alert("Meh", "Try again tomorrow!");
            setGameState("lost");
        }
    }

    const checkIfWon = () => {
        const row = rows[curRow - 1];
        return row.every((letter, i) => letter === letters[i])
    }
    const checkIfLost = () => {
        return !checkIfWon() && curRow === rows.length;
    }

    const onKeyPressed = (key) => {
        if (gameState !== "playing") {
            return;
        }
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

    const getCellColor = (row, col) => {
        const letter = rows[row][col];

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

    const getAllLetterColor = (color) => {
        return rows.flatMap((row, i) =>
            row.filter((cell, j) => getCellColor(i, j) === color)
        )
    }

    const greenCaps = getAllLetterColor(colors.primary);
    const yellowCaps = getAllLetterColor(colors.secondary);
    const greyCaps = getAllLetterColor(colors.darkgrey);

    return (
        <View>
            <ScrollView style={styles.map}>
                {rows.map((row, i) => (
                    <View style={styles.row} key={`row-${i}`}>
                        {row.map((cell, j) => (
                            <View
                                style={[
                                    styles.cell,
                                    {
                                        borderColor: isCellActive(i, j) ? colors.lightgrey : colors.darkgrey,
                                        backgroundColor: getCellColor(i, j),
                                    }
                                ]}
                                key={`cell-${i}-${j}`}>
                                <Text style={styles.cellText}>{cell.toUpperCase()}</Text>
                            </View>
                        ))}
                    </View>
                ))}
            </ScrollView>

            <Keyboard
                onKeyPressed={onKeyPressed}
                greenCaps={greenCaps}
                yellowCaps={yellowCaps}
                greyCaps={greyCaps}
            />

        </View>
    );
}

export default Game;