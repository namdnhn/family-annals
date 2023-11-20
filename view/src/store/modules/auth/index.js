import actions from "./actions.js";
import mutations from "./mutations.js";
import getters from "./getters.js";

export default {
    state() {
        return {
            token: null,
            userId: null,
            didAutoLogout: false,
            userInfo: {
                fullname: null,
                phone: null,
                date_of_birth: null,
                email: null,
            }
        }
    },
    actions,
    mutations,
    getters
}