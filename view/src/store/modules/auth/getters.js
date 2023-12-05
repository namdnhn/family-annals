export default {
    isAuthenticated(state) {
        return !!state.token;
    },
    getUserEmail(state) {
        return state.email;
    },
    getUserId(state) {
        return state.userId;
    },
    getToken(state) {
        return state.token;
    }
};
