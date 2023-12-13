<template>
    <main class="p-4 basis-3/4 flex flex-col gap-4">
        <h1
            class="text-base sm:text-lg md:text-xl lg:text-2xl text-sky-900 font-bold"
        >
            Dòng họ đã tạo
        </h1>

        <!-- Result bar  -->
        <div class="border px-4 py-2 flex flex-col gap-4">
            <p
                class="text-xs md:text-sm lg:text-base text-sky-900 font-semibold mb-2"
            >
                {{ families.length }} kết quả
            </p>
            <family-card
                v-for="family in families"
                :key="family._id"
                :id="family._id"
                :members_quantity="family.members.length"
                :name="family.name"
            ></family-card>
        </div>
        <base-spinner v-if="isLoading"></base-spinner>
    </main>
</template>

<script>
import FamilyCard from '../../../components/family/FamilyCard.vue'
export default {
    props: ["id"],
    components: {
        FamilyCard,
    },
    data() {
        return {
            families: [],
            isLoading: false    
        };
    },
    methods: {
        async getFamilies() {
            try {
                this.isLoading = true;
                this.families = await this.$store.dispatch(
                    "family/getFamilies"
                );
                this.families = this.families.filter(family => family.admin.includes(this.id));
                console.log('get families by admin id success');
            } catch (err) {
                console.log(err);
            }
            this.isLoading = false;
        },
    },
    mounted() {
        this.getFamilies();
    },
};
</script>
