<template>
    <div v-if="block.secondPerson" class="vue-family-tree__person">
        <div class="vue-family-tree__card">
            <slot name="card" :item="block.secondPerson">
                <Card
                    :image="block.secondPerson.image"
                    :name="block.secondPerson.name"
                    :source="block.secondPerson"
                    @click="$emit('card-click', $event)"
                />
            </slot>
        </div>
    </div>
</template>
