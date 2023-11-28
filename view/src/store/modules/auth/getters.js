export default {
    isAuthenticated(state) {
        return !!state.token;
    },
    getUserEmail(state) {
        return state.email;
    },
};
