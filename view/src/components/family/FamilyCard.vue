<template>
    <div
        class="border px-4 py-2 flex items-center gap-4 border-green-500 rounded-xl hover:cursor-pointer hover:border-green-700"
    >
        <img
            src="../../assets/images/logo.png"
            alt="logo family"
            class="h-20 w-20"
        />
        <span class="flex flex-col">
            <h1
                class="text-sm sm:text-base md:text-lg lg:text-xl text-sky-900 font-semibold"
            >
                {{ name }}
            </h1>
            <p class="text-xs md:text-sm lg:text-base text-sky-900">
                {{ members_quantity }} thành viên
            </p>
        </span>
    </div>
</template>

<script>
export default {
    props: {
        id: {
            type: String,
            required: true,
        },
        members_quantity: {
            type: Number,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    }
}
</script>