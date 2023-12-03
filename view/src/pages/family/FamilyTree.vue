<template>
    <main class="w-full">
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
                    spouse: [
                        {
                            name: "Jane Walker",
                            image: "https://picsum.photos/300/300?random=2",
                        },
                    ],
                    children: [
                        {
                            firstPerson: {
                                name: "John Walker Jr.",
                                image: "https://picsum.photos/300/300?random=3",
                            },
                            spouse: [
                                {
                                    name: "Jane Walker Jr.",
                                    image: "https://picsum.photos/300/300?random=4",
                                },
                            ],
                        },
                    ],
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
