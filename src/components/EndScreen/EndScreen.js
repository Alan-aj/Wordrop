import { View, Text, StyleSheet, Pressable } from "react-native"
import { colors } from "../../constants";
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Number = ({ number, label }) => (
    <View style={{ alignItems: "center", margin: 15 }}>
        <Text style={{ color: colors.lightgrey, fontSize: 40, fontWeight: "bold" }}>{number}</Text>
        <Text style={{ color: colors.lightgrey, fontSize: 20 }}>{label}</Text>
    </View>
)

const EndScreen = ({ won = false }) => {

    const [loaded, setLoaded] = useState(false);
    const [win, setWin] = useState(0)
    const [lose, setLose] = useState(0)
    const [played, setPlayed] = useState(0)

    useEffect(() => {
        readStatus();
    }, [])

    useEffect(() => {
        if (loaded) {
            storeStatus();
        }
    }, [win, lose, played])

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
        setLoaded(true)
    }

    const tryAgain = () => { }
    const nextLevel = () => { }

    return (
        <View style={{ margin: 30 }}>
            <Text style={styles.title}>{won ? "Congrats!" : "Level failed!"}</Text>
            <Text style={styles.subtitle}>SCORE</Text>
            <View style={{ flexDirection: "row" }}>
                <Number number={played} label={"Played"} />
                <Number number={win} label={"Win"} />
                <Number number={lose} label={"Lose"} />
            </View>
            <View style={{ flexDirection: "row", marginVertical: 30 }}>
                <Pressable onPress={tryAgain} style={{
                    flex: 1,
                    backgroundColor: colors.secondary,
                    borderRadius: 25,
                    margin: 5,
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Text>Try again</Text>
                </Pressable>
                <Pressable onPress={nextLevel} style={{
                    flex: 1,
                    backgroundColor: colors.primary,
                    borderRadius: 25,
                    margin: 5,
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Text>Next</Text>
                </Pressable>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        color: "white",
        textAlign: "center",
        marginVertical: 20,
    },
    subtitle: {
        fontSize: 20,
        color: colors.lightgrey,
        textAlign: "center",
        marginVertical: 15,

    }
})

export default EndScreen;