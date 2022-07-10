import { useEffect, useState } from 'react';
import { Text, View, ScrollView, Modal, ActivityIndicator, Pressable, Alert } from 'react-native';
import { colors, CLEAR, ENTER } from '../../constants'
import Keyboard from '../Keyboard'
// import words from '../../words';
import styles from "./Game.styles";
import { copyArray } from '../../Utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { SlideInLeft, ZoomIn, FlipInEasyY } from "react-native-reanimated";
import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import Help from '../Help';

const NUMBER_OF_TRIES = 6;
const TOTAL_LEVEL = 5;

const Number = ({ number, label }) => (
    <View style={{ alignItems: "center", margin: 15 }}>
        <Text style={{ color: colors.lightgrey, fontSize: 40, fontWeight: "bold" }}>{number}</Text>
        <Text style={{ color: colors.lightgrey, fontSize: 20 }}>{label}</Text>
    </View>
)

const Game = () => {
    
    var randomWords = require('random-words');
    // AsyncStorage.removeItem("@game")
    // AsyncStorage.removeItem("@status")


    const [loaded, setLoaded] = useState(false);
    const [win, setWin] = useState(0)
    const [lose, setLose] = useState(0)
    const [played, setPlayed] = useState(0)
    const [newWord, setNewWord] = useState(randomWords())
    const [gamePlayed, setGamePlayed] = useState(0)
    // const word = words[gamePlayed];
    const letters = newWord.split('');
    const [rows, setRows] = useState(
        new Array(NUMBER_OF_TRIES).fill(new Array(newWord.length).fill(""))
    );
    const [curRow, setCurRow] = useState(0);
    const [curCol, setCurCol] = useState(0);
    const [gameState, setGameState] = useState("playing"); // won,lost,playing
    const [modalView, setModalView] = useState(false);
    const [helpModal, setHelpModal] = useState(false);


    useEffect(() => {
        if (curRow > 0) {
            checkGameState();
        }
    }, [curRow])

    useEffect(() => {
        if (loaded) {
            storeState();
        }
    }, [rows, curRow, curCol, gameState, modalView])

    useEffect(() => {
        readStatus();
        readState();
    }, [])

    useEffect(() => {
        if (loaded) {
            storeStatus();
        }
    }, [win, lose, played, gamePlayed])


    const storeState = async () => {
        const data = {
            rows,
            curRow,
            curCol,
            gameState,
            newWord,
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
            setNewWord(data.newWord);
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
            gamePlayed
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
            setGamePlayed(data.gamePlayed)
        } catch (e) {
            console.log("Couldn't read the status");
        }

    }

    const checkGameState = () => {
        if (checkIfWon() && gameState !== "won") {

            setGameState("won");
            setWin(prevCount => prevCount + 1)
            setPlayed(prevCount => prevCount + 1)
            setTimeout(() => { setModalView(true) }, 500);
        } else if (checkIfLost() && gameState !== "lost") {

            setGameState("lost");
            setLose(prevCount => prevCount + 1)
            setPlayed(prevCount => prevCount + 1)
            setTimeout(() => { setModalView(true) }, 500);
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

    const getCellStyle = (i, j) => [
        styles.cell,
        {
            borderColor: isCellActive(i, j) ? colors.lightgrey : colors.darkgrey,
            backgroundColor: getCellColor(i, j),
        }
    ]

    if (!loaded) {
        return (<ActivityIndicator />)
    }

    const tryAgain = async () => {
        try {
            await AsyncStorage.removeItem("@game")
            setRows(new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill("")))
            setCurRow(0);
            setCurCol(0);
            setGameState("playing");
            setModalView(false)
        }
        catch (e) {
            console.log("failed to remove")
        }

    }
    const nextLevel = async () => {
        try {
            await AsyncStorage.removeItem("@game")
            setNewWord(randomWords())
            // const newLetter = words[gamePlayed + 1]
            setGamePlayed(prevCount => prevCount + 1)

            setRows(
                new Array(NUMBER_OF_TRIES).fill(new Array(newWord.length).fill(""))
            )
            setCurRow(0);
            setCurCol(0);
            setGameState("playing");
            setModalView(false)
        }
        catch (e) {
            console.log("failed to remove")
        }
    }

    return (
        <>
            <Pressable style={{
                flexDirection: "row",
                borderRadius: 5,
                margin: 5,
                padding: 5
            }}>
                <AntDesign name="infocirlceo" size={24} color={colors.grey} style={{ marginHorizontal: 10 }} onPress={() => { setModalView(!modalView) }} />
                <AntDesign name="questioncircleo" size={24} color={colors.grey} style={{ marginHorizontal: 10 }} onPress={() => { setHelpModal(!helpModal) }} />
            </Pressable>
            <ScrollView style={styles.map}>
                {rows.map((row, i) => (
                    <Animated.View entering={SlideInLeft.delay(i * 30)} style={styles.row} key={`row-${i}`}>
                        {row.map((cell, j) => (
                            <React.Fragment key={`main-${i}-${j}`}>
                                {i < curRow && (
                                    <Animated.View entering={FlipInEasyY.delay(j * 80)}
                                        style={getCellStyle(i, j)}
                                        key={`cell-color-${i}-${j}`}>
                                        <Text style={styles.cellText}>{cell.toUpperCase()}</Text>
                                    </Animated.View>
                                )}
                                {i === curRow && !!cell && (
                                    <Animated.View entering={ZoomIn}
                                        style={getCellStyle(i, j)}
                                        key={`cell-active-${i}-${j}`}>
                                        <Text style={styles.cellText}>{cell.toUpperCase()}</Text>
                                    </Animated.View>
                                )}
                                {!cell && (
                                    <View
                                        style={getCellStyle(i, j)}
                                        key={`cell-${i}-${j}`}>
                                        <Text style={styles.cellText}>{cell.toUpperCase()}</Text>
                                    </View>
                                )}
                            </React.Fragment>
                        ))}
                    </Animated.View>
                ))}
            </ScrollView>

            <Keyboard
                onKeyPressed={onKeyPressed}
                greenCaps={greenCaps}
                yellowCaps={yellowCaps}
                greyCaps={greyCaps}
            />
            <Modal
                visible={modalView}
                transparent
                animationType='fade'
            >
                <View style={styles.centered}>
                    <View style={styles.model}>
                        <AntDesign name="closecircleo" size={24} color={colors.grey} style={{ alignSelf: "flex-end", position: "absolute", padding: 10, }} onPress={() => { setModalView(!modalView) }} />
                        <Text style={styles.title}>{gameState === "playing" ? "Paused!" : gameState === "won" ? "Congrats!" : "Level failed!"}</Text>
                        <Text style={styles.subtitle}>SCORE</Text>
                        <View style={{ flexDirection: "row", justifyContent: "center" }}>
                            <Number number={played} label={"Played"} />
                            <Number number={win} label={"Win"} />
                            <Number number={lose} label={"Lose"} />
                        </View>
                        <View style={{ flexDirection: "row", marginVertical: 35, marginHorizontal: 10 }}>
                            <Pressable onPress={tryAgain} disabled={gameState == "playing"} style={{
                                flex: 1,
                                backgroundColor: colors.secondary,
                                borderRadius: 25,
                                margin: 5,
                                padding: 10,
                                alignItems: "center",
                                justifyContent: "center",
                                elevation: 5
                            }}>
                                <Text>Try again</Text>
                            </Pressable>
                            <Pressable onPress={nextLevel} disabled={TOTAL_LEVEL == gamePlayed + 1 || gameState == "playing"} style={{
                                flex: 1,
                                backgroundColor: colors.primary,
                                borderRadius: 25,
                                margin: 5,
                                padding: 10,
                                alignItems: "center",
                                justifyContent: "center",
                                elevation: 5
                            }}>
                                <Text>Next level</Text>
                            </Pressable>
                        </View>

                    </View>
                </View>
            </Modal>
            <Modal
                visible={helpModal}
                transparent
                animationType='fade'
            >
                <View style={styles.centered}>
                    <View style={styles.model}>
                        <AntDesign name="closecircleo" size={24} color={colors.grey} style={{ alignSelf: "flex-end", position: "absolute", padding: 10 }} onPress={() => { setHelpModal(!helpModal) }} />
                        <Help />

                    </View>
                </View>
            </Modal>
        </>
    );
}

export default Game;