export function addValue(...value) {
    return value.reduce((add, value, index) => {
        return add + value;
    }, 0)
}