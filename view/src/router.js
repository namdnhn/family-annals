import { createRouter, createWebHistory } from "vue-router";
import { defineAsyncComponent } from "vue";

const HomePage = defineAsyncComponent(() => import('./pages/HomePage.vue'));
const AuthPage = defineAsyncComponent(() => import('./pages/auth/AuthPage.vue'));

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/homepage'
        },
        {
            path: '/homepage',
            component: HomePage
        },
        {
            path: '/auth',
            component: AuthPage
        },
    ],
    scrollBehavior() {
		return { top: 0, behavior: "smooth" };
	},
})

export default router;