import { useEffect, useState } from 'react';
import { Text, View, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { colors, CLEAR, ENTER } from '../../constants'
import Keyboard from '../Keyboard'
import words from '../../words';
import styles from "./Game.styles";
import { copyArray } from '../../Utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EndScreen from '../EndScreen'

const NUMBER_OF_TRIES = 6;

const Game = () => {

    // AsyncStorage.removeItem("@game")
    // AsyncStorage.removeItem("@status")

    const [loaded, setLoaded] = useState(false);
    const [win, setWin] = useState(0)
    const [lose, setLose] = useState(0)
    const [played, setPlayed] = useState(0)

    const word = words[1];
    const letters = word.split('');
    const [rows, setRows] = useState(
        new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(""))
    );
    const [curRow, setCurRow] = useState(0);
    const [curCol, setCurCol] = useState(0);
    const [gameState, setGameState] = useState("playing"); // won,lost,playing
    // const [showModal, setShowModal] = useState(false);



    useEffect(() => {
        if (curRow > 0) {
            checkGameState();
        }
    }, [curRow])

    useEffect(() => {
        if (loaded) {
            storeState();
        }
    }, [rows, curRow, curCol, gameState])

    useEffect(() => {
        readStatus();
        readState();
    }, [])

    useEffect(() => {
        if (loaded) {
            storeStatus();
        }
    }, [win, lose, played])


    const storeState = async () => {
        const data = {
            rows,
            curRow,
            curCol,
            gameState
        }
        try {
            const dataString = JSON.stringify(data);
            await AsyncStorage.setItem("@game", dataString);
        } catch (e) {
            console.log("Failed to write data to async storage", e);
        }

    };

    const readState = async () => {
        const dataString = await AsyncStorage.getItem("@game");
        try {
            const data = JSON.parse(dataString);
            setRows(data.rows);
            setCurRow(data.curRow);
            setCurCol(data.curCol);
            setGameState(data.gameState);
        } catch (e) {
            console.log("Couldn't parse the state");
        }

        setLoaded(true);
    }

    const storeStatus = async () => {
        const data = {
            played,
            win,
            lose,
        }
        try {
            const dataString = JSON.stringify(data);
            await AsyncStorage.setItem("@status", dataString);
        } catch (e) {
            console.log("Failed to write stat to async storage", e);
        }
    }
    const readStatus = async () => {
        const dataString = await AsyncStorage.getItem("@status");
        try {
            const data = JSON.parse(dataString);
            setWin(data.win);
            setLose(data.lose);
            setPlayed(data.played);
            console.log(data)
        } catch (e) {
            console.log("Couldn't read the status");
        }

    }

    const checkGameState = () => {
        if (checkIfWon() && gameState !== "won") {
            // Alert.alert("Hurraay", "You won!", [
            //     {
            //         text: "Refresh",
            //         onPress: () => AsyncStorage.removeItem("@game"),
            //         style: "default",
            //     },
            // ]);
            setGameState("won");
            setWin(prevCount => prevCount + 1)
            setPlayed(prevCount => prevCount + 1)
        } else if (checkIfLost() && gameState !== "lost") {
            // Alert.alert("Meh", "Try again tomorrow!", [
            //     {
            //         text: "Refresh",
            //         onPress: () => AsyncStorage.removeItem("@game"),
            //         style: "default",
            //     },
            // ]);
            setGameState("lost");
            setLose(prevCount => prevCount + 1)
            setPlayed(prevCount => prevCount + 1)
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

    if (!loaded) {
        return (<ActivityIndicator />)
    }

    if (gameState !== "playing") {
        return (
            <EndScreen won={gameState === "won"} />
        )

    }

    return (
        <>
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

            {/* <Modal
                visible={showModal}
            >
                
            </Modal> */}

        </>
    );
}

export default Game;