<template>
    <the-header></the-header>
    <router-view v-slot="slotProps">
        <transition name="route" mode="out-in">
            <component :is="slotProps.Component"></component>
        </transition>
    </router-view>
</template>

<script>
import TheHeader from "./components/layouts/TheHeader.vue";
export default {
    components: {
        TheHeader,
    },
    //auto login
    mounted() {
        this.$store.dispatch("autoLogin");
    },
};
</script>

<style>
.route-enter-from {
    opacity: 0;
    transform: translateY(-30px);
}

.route-leave-to {
    opacity: 0;
    transform: translateY(30px);
}

.route-enter-to,
.route-leave-from {
    opacity: 1;
    transform: translateY(0);
}

.route-enter-active {
    transition: all 0.3s ease-out;
}

.route-leave-active {
    transition: all 0.3s ease-in;
}
</style>
