import { StyleSheet } from 'react-native';
import { colors } from '../../constants'

export default StyleSheet.create({
    map: {
        alignSelf: "stretch",
        margin: 10,
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
        maxWidth: 60,
        justifyContent: "center",
        alignItems: "center",
    },
    cellText: {
        color: colors.lightgrey,
        fontWeight: "bold",
        fontSize: 28,
    },
    title: {
        fontSize: 30,
        color: "white",
        textAlign: "center",
        marginVertical: 30,
        justifyContent: "center"
    },
    subtitle: {
        fontSize: 20,
        color: colors.lightgrey,
        textAlign: "center",
        marginVertical: 15,
        justifyContent: "center"
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#00000099"
    },
    model: {
        // flex: .5,
        width:300,
        height: 380,
        backgroundColor: colors.darkgrey,
        borderRadius: 20,
        padding: 10
    }
});