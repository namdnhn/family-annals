<template>
    <main class="pt-16 lg:pt-20 flex">
        <!-- side bar  -->
        <div class="basis-1/4 border px-4 py-4 flex flex-col gap-4 bg-gray-100 min-h-screen">
            <h1
                class="text-base sm:text-lg md:text-xl lg:text-2xl text-sky-900 font-bold "
            >
                Menu
            </h1>

            <ul class="flex flex-col gap-2">
                <router-link
                    :to="createdLink"
                    class="px-4 py-2 bg-white rounded-lg shadow border text-xs sm:text-sm md:text-base lg:text-lg hover:cursor-pointer hover:text-green-600"
                >
                    Dòng họ đã tạo
                </router-link>
                <router-link
                    :to="addLink"
                    class="px-4 py-2 bg-white rounded-lg shadow border text-xs sm:text-sm md:text-base lg:text-lg hover:cursor-pointer hover:text-green-600"
                >
                    Tạo dòng họ mới
                </router-link>
                <router-link
                    :to="manageMemberLink"
                    class="px-4 py-2 bg-white rounded-lg shadow border text-xs sm:text-sm md:text-base lg:text-lg hover:cursor-pointer hover:text-green-600"
                >
                    Quản lí thành viên
                </router-link>
                <router-link
                    :to="manageAdminLink"
                    class="px-4 py-2 bg-white rounded-lg shadow border text-xs sm:text-sm md:text-base lg:text-lg hover:cursor-pointer hover:text-green-600"
                >
                    Thông tin admin
                </router-link>
            </ul>
        </div>

        <!-- main content  -->
        <router-view v-slot="slotProps">
            <transition name="route" mode="out-in">
                <component :is="slotProps.Component"></component>
            </transition>
        </router-view>
    </main>
</template>

<script>
export default {
    props: ["id"],
    data() {
        return {
            userId: null,
        };
    },
    mounted() {
        console.log(this.id);
    },
    computed: {
        createdLink() {
            return `/family/manage/${this.id}/created`;
        },
        addLink() {
            return `/family/manage/${this.id}/add`;
        },
        manageMemberLink() {
            return `/family/manage/${this.id}/member`;
        },
        manageAdminLink() {
            return `/family/manage/${this.id}/admin`;
        },
    },
};
</script>
