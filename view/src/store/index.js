import {createStore} from 'vuex'

import authModule from './modules/auth/index.js'
import familyModule from './modules/family/index.js'

const store = createStore({
    modules: {
        auth: authModule,
        family: familyModule
    },
    state() {
        return {
            apiUrl: 'http://localhost:8080/'
        }
    },
    getters: {
        getApiUrl(state) {
            return state.apiUrl
        }
    }
})

export default store