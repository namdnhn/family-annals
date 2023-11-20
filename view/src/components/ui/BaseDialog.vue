<template>
    <teleport to="body">
        <div
            v-if="show"
            @click="tryClose"
            class="fixed top-0 left-0 w-full h-screen z-50 backdrop"
        ></div>
        <transition name="dialog">
            <div
                class="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50"
                v-if="show"
            >
                <dialog
                    open
                    class="px-10 py-4 h-48 w-96 flex flex-col justify-between items-center rounded-lg"
                >
                    <header
                        class="text-sm md:text-base lg:text-lg font-bold text-sky-900"
                    >
                        <slot name="header">
                            <h2>{{ title }}</h2>
                        </slot>
                    </header>
                    <section
                        class="text-center text-xs md:text-sm lg:text-base text-sky-900"
                    >
                        <slot></slot>
                    </section>
                    <menu>
                        <slot name="actions">
                            <button
                                @click="tryClose"
                                class="bg-green-300 p-2 rounded-lg text-green-900 text-xs md:text-sm lg:text-base"
                            >
                                Đóng
                            </button>
                        </slot>
                    </menu>
                </dialog>
            </div>
        </transition>
    </teleport>
</template>

<script>
export default {
    props: {
        show: {
            type: Boolean,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
    },
    emits: ["close"],
    methods: {
        tryClose() {
            this.$emit("close");
        },
    },
};
</script>

<style scoped>
.backdrop {
    background-color: rgba(0, 0, 0, 0.75);
}

.dialog-enter-from,
.dialog-leave-to {
    opacity: 0;
    transform: scale(0.8);
}

.dialog-enter-to,
.dialog-leave-from {
    opacity: 1;
    transform: scale(1);
}

.dialog-enter-active {
    transition: all 0.3s ease-out;
}

.dialog-leave-active {
    transition: all 0.3s ease-in;
}
</style>
