const initialState = {
    sessions: [],
    selectedSession: null,
    loading: false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_SESSIONS_START':
            return { ...state, loading: true }
        case 'FETCH_SESSIONS_SUCCESS':
            return {
                ...state,
                loading: false,
                sessions: action.sessions
            }
        case 'FETCH_SESSIONS_FAILED':
            return { ...state, loading: false }
        default:
            return state
    }
}

export default reducer;



