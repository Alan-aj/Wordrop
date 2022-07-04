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
        maxWidth: 65,
        justifyContent: "center",
        alignItems: "center",
    },
    cellText: {
        color: colors.lightgrey,
        fontWeight: "bold",
        fontSize: 28,
    },
});