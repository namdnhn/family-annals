import {createStore} from 'vuex'

import authModule from './modules/auth/index.js'

const store = createStore({
    modules: {
        auth: authModule
    },
    state() {
        return {
            apiUrl: 'https://magic-post-api.vercel.app/'
        }
    },
    getters: {
        getApiUrl(state) {
            return state.apiUrl
        }
    }
})

export default store