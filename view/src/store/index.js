import {createStore} from 'vuex'

import authModule from './modules/auth/index.js'
import familyModule from './modules/family/index.js'
import memberModule from './modules/member/index.js'

const store = createStore({
    modules: {
        auth: authModule,
        family: familyModule,
        member: memberModule
    },
    state() {
        return {
            // apiUrl: 'https://family-annals-api.vercel.app/'
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