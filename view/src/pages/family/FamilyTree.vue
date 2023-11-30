<template>
    <main class="pt-16 lg:pt-20 w-full">
        <div id="app" class="">
            asdasd
            <VueFamilyTree :tree="tree" @card-click="cardClick" />
        </div>
    </main>
</template>

<script>
import VueFamilyTree from "../../components/tree/VueFamilyTree.vue";
export default {
    components: {
        VueFamilyTree,
    },
    data() {
        return {
            tree: [
                {
                    firstPerson: {
                        name: "John Walker",
                        image: "https://picsum.photos/300/300?random=1",
                    },
                    secondPerson: {
                        name: "Jannet Grem",
                        image: "https://picsum.photos/300/300?random=2",
                    },
                },
            ],
        };
    },
    methods: {
        cardClick(item) {
            console.log(item);
        },
    },
};
</script>
