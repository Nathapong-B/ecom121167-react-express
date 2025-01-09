export const useMultiState = (usestore, ...items) => {
    return items.reduce((accState, item) => ({
        ...accState,
        [item]: usestore(state => state[item]),
    }), {})
};