import { View, Text, StyleSheet, Pressable } from "react-native"
import { colors } from "../../constants";


const Help = () => {

    return (
        <>
            <Text>Help</Text>
        </>
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

export default Help;