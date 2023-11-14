<template>
    <the-header></the-header>
    <router-view v-slot="slotProps">
        <transition name="route" mode="out-in">
            <component :is="slotProps.Component"></component>
        </transition>
    </router-view>
</template>

<script>
import TheHeader from './components/layouts/TheHeader.vue';
export default {
    components: {
        TheHeader
    },
    //auto login
    mounted() {
        this.$store.dispatch('autoLogin')
    }
}
</script>