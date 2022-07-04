export const copyArray = (arr) => {
    return [...arr.map((rows) => [...rows])]
}