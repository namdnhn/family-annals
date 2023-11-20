<template>
    <header class="bg-green-200 h-20 fixed top-0 right-0 left-0">
        <router-link to="/auth">Auth</router-link>
        <p v-if="isLoggedIn">Authenticated</p>
        <p v-else>Not Authenticated</p>

        <button @click="logout">Logout</button>
    </header>
</template>

<script>
    export default {
        data() {
            return {
                
            }
        },
        methods: {
            logout() {
                this.$store.dispatch('logout')
            }
        },
        computed: {
            isLoggedIn() {
                return this.$store.getters.isAuthenticated
            }
        }
    }
</script>