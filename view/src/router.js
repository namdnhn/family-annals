import { createRouter, createWebHistory } from "vue-router";
import { defineAsyncComponent } from "vue";
import store from "./store/index.js";

const HomePage = defineAsyncComponent(() => import("./pages/HomePage.vue"));
const AuthPage = defineAsyncComponent(() =>
    import("./pages/auth/AuthPage.vue")
);

const FamilyTree = defineAsyncComponent(() =>
    import("./pages/family/FamilyTree.vue")
);

const FamilyPage = defineAsyncComponent(() =>
    import("./pages/family/FamilyPage.vue")
);

const ManageFamily = defineAsyncComponent(() =>
    import("./pages/family/manage/ManageFamily.vue")
);

const CreatedFamily = defineAsyncComponent(() =>
    import("./pages/family/manage/CreatedFamily.vue")
);

const CreateNew = defineAsyncComponent(() =>
    import("./pages/family/manage/CreateNew.vue")
);

const ManageMembers = defineAsyncComponent(() => import("./pages/family/manage/ManageMembers.vue"));

const AdminInfo = defineAsyncComponent(() => import("./pages/family/manage/AdminInfo.vue"));

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            redirect: "/homepage",
        },
        {
            path: "/homepage",
            component: HomePage,
        },
        {
            path: "/auth",
            component: AuthPage,
        },

        {
            path: "/family",
            component: FamilyPage,
        },
        {
            path: "/family/:id/tree",
            component: FamilyTree,
            props: true,
        },
        {
            path: "/family/manage/:id",
            component: ManageFamily,
            props: true,
            meta: { requiresAuth: true },
            children: [
                {
                    path: "/family/manage/:id/created",
                    component: CreatedFamily,
                    props: true,
                },
                {
                    path: "/family/manage/:id/add",
                    component: CreateNew,
                    props: true,
                },
                {
                    path: "/family/manage/:id/member",
                    component: ManageMembers,
                    props: true,
                },
                {
                    path: "/family/manage/:id/admin",
                    component: AdminInfo,
                    props: true,
                },
            ],
        },
    ],
    scrollBehavior() {
        return { top: 0, behavior: "smooth" };
    },
});

router.beforeEach(function (to, _, next) {
	if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
		next("/auth");
	} else if (to.meta.requiresUnAuth && store.getters.isAuthenticated) {
		next("/homepage");
	} else {
		next();
	}
});

export default router;
