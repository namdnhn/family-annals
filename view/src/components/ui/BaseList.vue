<template>
    <router-link
        :to="to"
        v-if="to"
        class="flex justify-between items-center gap-4 py-2 px-4 m-2 rounded-md bg-slate-100 hover:cursor-pointer hover:text-green-600 min-w-full"
        @mouseover="isShowIcon = true"
        @mouseleave="isShowIcon = false"
    >
        <li class="flex items-center justify-between w-full">
            <span class="flex justify-center gap-3 items-center">
                <font-awesome-icon
                    :icon="icon"
                    class="text-sm md:text-base lg:text-xl text-green-600"
                />
                <p class="text-xs md:text-sm lg:text-base">{{ title }}</p>
            </span>
            <font-awesome-icon
                icon="fa-solid fa-arrow-right"
                v-if="isShowIcon"
            />
        </li>
    </router-link>
    <li
        class="flex justify-between items-center gap-4 py-2 px-4 mt-2 mb-2 rounded-md bg-slate-100 hover:cursor-pointer hover:text-green-600 min-w-full"
        @mouseover="isShowIcon = true"
        @mouseleave="isShowIcon = false"
        v-else
    >
        <span class="flex justify-center gap-3 items-center">
            <font-awesome-icon
                :icon="icon"
                class="text-sm md:text-base lg:text-xl text-green-600"
            />
            <p class="text-xs md:text-sm lg:text-base">{{ title }}</p>
        </span>
        <font-awesome-icon icon="fa-solid fa-arrow-right" v-if="isShowIcon" />
    </li>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
            required: true,
        },
        to: {
            type: String,
            required: false,
        },
    },
    data() {
        return {
            isShowIcon: false,
        };
    },
};
</script>
