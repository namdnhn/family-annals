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
                    thirdPerson: {
                        name: "Jannet Grem",
                        image: "https://picsum.photos/300/300?random=3",
                    },
                    children: [
                        {
                            firstPerson: {
                                name: "John Walker",
                                image: "https://picsum.photos/300/300?random=4",
                            },
                            secondPerson: {
                                name: "Jannet Grem",
                                image: "https://picsum.photos/300/300?random=5",
                            },
                            thirdPerson: {
                                name: "Jannet Grem",
                                image: "https://picsum.photos/300/300?random=6",
                            },
                            children: [{
                                firstPerson: {
                                    name: "John Walker",
                                    image: "https://picsum.photos/300/300?random=7",
                                },
                                secondPerson: {
                                    name: "Jannet Grem",
                                    image: "https://picsum.photos/300/300?random=8",
                                },
                                thirdPerson: {
                                    name: "Jannet Grem",
                                    image: "https://picsum.photos/300/300?random=9",
                                },
                                children: [
                                    {
                                        firstPerson: {
                                            name: "John Walker",
                                            image: "https://picsum.photos/300/300?random=10",
                                        },
                                        secondPerson: {
                                            name: "Jannet Grem",
                                            image: "https://picsum.photos/300/300?random=11",
                                        },
                                        thirdPerson: {
                                            name: "Jannet Grem",
                                            image: "https://picsum.photos/300/300?random=12",
                                        },
                                    },
                                    {
                                        firstPerson: {
                                            name: "John Walker",
                                            image: "https://picsum.photos/300/300?random=13",
                                        },
                                        
                                    },
                                    {
                                        firstPerson: {
                                            name: "John Walker",
                                            image: "https://picsum.photos/300/300?random=14",
                                        },
                                        
                                    }
                                    ,
                                    {
                                        firstPerson: {
                                            name: "John Walker",
                                            image: "https://picsum.photos/300/300?random=14",
                                        },
                                        
                                    }
                                    ,
                                    {
                                        firstPerson: {
                                            name: "John Walker",
                                            image: "https://picsum.photos/300/300?random=14",
                                        },
                                        
                                    }
                                    ,
                                    {
                                        firstPerson: {
                                            name: "John Walker",
                                            image: "https://picsum.photos/300/300?random=14",
                                        },
                                        
                                    }
                                    ,
                                    {
                                        firstPerson: {
                                            name: "John Walker",
                                            image: "https://picsum.photos/300/300?random=14",
                                        },
                                        
                                    }
                                    
                                ]
                            }]
                        },
                        {
                            firstPerson: {
                                name: "John Walker",
                                image: "https://picsum.photos/300/300?random=5",
                            },

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
