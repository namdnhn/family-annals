<template>
    <div>
        <div>
            <VueFamilyTreeBranch :tree="tree" @card-click="cardClick">
                <template v-slot:card="{ item }">
                    <slot name="card" :item="item" />
                </template>
            </VueFamilyTreeBranch>
        </div>
    </div>
</template>

<script>
import VueFamilyTreeBranch from "./components/Branch.vue";

export default {
    name: "VueFamilyTree",
    components: {
        VueFamilyTreeBranch,
    },
    props: {
        tree: {
            type: Array,
            default() {
                return [];
            },
        },
    },
};
</script>
