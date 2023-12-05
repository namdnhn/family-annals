<template>
    <div class="vue-family-tree__branch">
        <div class="vue-family-tree__row">
            <div
                v-for="(block, index) in tree"
                :key="index"
                class="vue-family-tree__col"
                :class="{
                    'vue-family-tree__col_couple':
                        block.firstPerson && block.spouse.length > 0,
                }"
                :style="`--wives-count: ${block.spouse.length + 1}`"
            >
                <div class="vue-family-tree__content">
                    <div
                        :class="{
                            'vue-family-tree__couple':
                                block.firstPerson && block.spouse.length > 0,
                            'vue-family-tree__couple_children':
                                block.children && block.children.length,
                        }"
                    >
                        <div
                            v-if="block.firstPerson"
                            class="vue-family-tree__person"
                        >
                            <div class="vue-family-tree__card">
                                <slot name="card" :item="block.firstPerson">
                                    <Card
                                        :image="block.firstPerson.image"
                                        :fullname="block.firstPerson.fullname"
                                        :source="block.firstPerson"
                                        @click="$emit('card-click', $event)"
                                        @update-tree="$emit('update-tree')"
                                    />
                                </slot>
                            </div>
                        </div>
                        <div
                            v-for="spouse in block.spouse"
                            class="vue-family-tree__person"
                        >
                            <div class="vue-family-tree__card">
                                <slot name="card" :item="spouse">
                                    <Card
                                        :image="spouse.image"
                                        :fullname="spouse.fullname"
                                        :source="spouse"
                                        @click="$emit('card-click', $event)"
                                        @update-tree="$emit('update-tree')"
                                    />
                                </slot>
                            </div>
                        </div>
                    </div>
                </div>
                <VueFamilyTreeBranch
                    v-if="block.children"
                    :tree="block.children"
                    @card-click="$emit('card-click', $event)"
                    @update-tree="$emit('update-tree')"
                >
                    <template v-slot:card="{ item }">
                        <slot name="card" :item="item" />
                    </template>
                </VueFamilyTreeBranch>
            </div>
        </div>
    </div>
</template>

<script>
import Card from "./Card.vue";

export default {
    name: "VueFamilyTreeBranch",
    components: {
        Card,
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

<style lang="scss" scoped>
.vue-family-tree {
    &__branch {
        position: relative;
        .vue-family-tree__branch {
            padding-top: 40px;
            display: flex;
            .vue-family-tree__col {
                padding-top: 16px;
                &:before {
                    content: "";
                    position: absolute;
                    top: 0;
                    width: 100%;
                    height: 16px;
                    left: 82px;
                    border-top: 1px solid #ddd;
                }
                &:after {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 82px;
                    height: 16px;
                    width: 1px;
                    background-color: #ddd;
                }
                &:first-child {
                    &:before {
                        width: calc(100%);
                        border-left: 1px solid #ddd;
                    }
                    &:after {
                        display: none;
                    }
                }
                &:last-child {
                    &:before {
                        width: 0;
                        border-right: 1px solid #ddd;
                        left: 82px;
                        right: auto;
                    }
                    &:after {
                        display: none;
                    }
                }
                &:first-child:last-child {
                    padding-top: 0;
                    &:before {
                        display: none;
                    }
                    &:after {
                        display: none;
                    }
                }
                &_couple {
                    &:before {
                        content: "";
                        position: absolute;
                        top: 0;
                        width: calc(
                            100% -
                                ((100% - var(--wives-count) * 132px) / 2 + 82px) +
                                82px
                        );
                        height: 16px;
                        left: calc(
                            (100% - var(--wives-count) * 132px) / 2 + 82px
                        );
                        border-top: 1px solid #ddd;
                    }

                    &:after {
                        // left: calc(50% - 58px);
                        left: calc(
                            (100% - var(--wives-count) * 132px) / 2 + 82px
                        );
                    }
                    &:first-child {
                        &:before {
                            // width: calc(50% + 140px);
                            width: calc(
                                100% -
                                    (
                                        (100% - var(--wives-count) * 132px) / 2 +
                                            82px
                                    ) + 82px
                            );
                            //1 nguoi trong couple content thi la 132px
                            left: calc(
                                (100% - var(--wives-count) * 132px) / 2 + 82px
                            );
                        }
                    }
                    &:last-child {
                        &:before {
                            content: "";
                            position: absolute;
                            top: 0;
                            width: calc((100% - var(--wives-count) * 132px) / 2 );
                            height: 16px;
                            border-top: 1px solid #ddd;
                        }
                    }
                    // &:first-child:last-child {
                    //     padding-left: 146px;
                    // }
                }
            }
        }
    }
    &__row {
        display: flex;
        justify-content: center;
    }
    &__col {
        position: relative;
        // & + .vue-family-tree__col {
        //     padding-left: 16px;
        // }
        .vue-family-tree__col {
            padding-left: 16px;
        }
    }
    &__content {
        display: flex;
        justify-content: center;
    }
    &__couple {
        position: relative;
        display: inline-flex;

        .vue-family-tree__person {
            padding-left: 32px;
            // padding-right: 16px;
            &:before {
                content: "";
                position: absolute;
                top: 50px;
                right: 0;
                height: 1px;
                margin-right: -32px;
                width: 32px;
                background-color: #ddd;
            }
            &:last-child {
                &:before {
                    display: none;
                }
            }
        }
        &_children {
            .vue-family-tree__person {
                &:first-child {
                    &::after {
                        content: "";
                        position: absolute;
                        top: 100px;
                        left: calc(50% + 16px);
                        width: 1px;
                        height: calc(100% - 60px);
                        background-color: #ddd;
                    }
                }
            }
        }
    }
    &__person {
        padding-left: 16px;
        height: 156px;
        position: relative;
        z-index: 10;
    }
}
.vue-family-tree__col.vue-family-tree__col_couple {
    padding-left: 0;
}
</style>
