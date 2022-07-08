import { Text, StyleSheet, Pressable, ScrollView } from "react-native"
import { colors } from "../../constants";
import { AntDesign } from '@expo/vector-icons';

const Help = () => {

    return (
        <>
            <Text style={styles.title}>How to Play</Text>
            <ScrollView>
            <Text style={styles.subtitle}>1. Enter the first word</Text>
            <Text style={styles.contents}>To get started, simply enter any word to find out which letters match the hidden word. In total, you will have 6 tries to guess the hidden word.</Text>
            <Text style={styles.subtitle}>2. Find out what letters are in the hidden word</Text>
            <Text style={styles.contents}>If any letters are marked in yellow, this means that this letter is in the hidden word, but doesn't match the exact location in this word. If any letter is marked in green, then it is in that word and is in the exact location. If the letter remains gray, then it isn't in the hidden word.</Text>
            <Text style={styles.subtitle}>3. Try to guess the hidden word</Text>
            <Text style={styles.contents}>Now if you know a few letters with the exact location (green) and a few letters that are in the word (yellow) you can try to solve the hidden word and win the game!</Text>
            <Pressable style={styles.about} ><Text style={styles.textabout}>Alanban</Text>
            <AntDesign name="smileo" size={16} color={colors.lightgrey} style={{marginRight: 5,}} />
            </Pressable>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        color: "white",
        textAlign: "center",
        marginVertical: 20,
        marginBottom: 10,
        justifyContent: "center",
    },
    subtitle: {
        fontSize: 20,
        color: colors.lightgrey,
        textAlign:"center",
        paddingHorizontal: 10,
        marginVertical: 15,
        justifyContent: "center"
    },
    contents: {
        color: colors.grey,
        textAlign: "justify",
        paddingHorizontal: 10,
    },
    about: {
        alignSelf: "center",
        borderWidth:1,
        borderColor: colors.secondary,
        margin: 20,
        borderRadius: 20,
        width: 95,
        alignItems: "center",
        justifyContent: "center",
        elevation:3,
        flexDirection: "row"
    },
    textabout: {
        textAlign: "center",
        margin: 5,
        color: colors.lightgrey,
    }
})

export default Help;