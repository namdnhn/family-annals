<template>
    <div class="vue-family-card">
        <a
            href="#"
            @click.prevent="click"
            class="vue-family-card__image"
            :style="{ backgroundImage: image ? `url(${image})` : null }"
        />
        <div class="vue-family-card__name">
            <a href="#" @click.prevent="click">
                {{ fullname }}
            </a>
        </div>
        <base-form
            v-if="isShowMemberInfo"
            :show="isShowMemberInfo"
            @close="closeMemberInfo"
            :id="this.memberViewd.id"
            :fullname="this.memberViewd.fullname"
            :gender="this.memberViewd.gender"
        ></base-form>
    </div>
</template>

<script>
import BaseForm from "../../ui/BaseForm.vue";
export default {
    name: "FamilyCard",
    components: {
        BaseForm,
    },
    props: {
        fullname: String,
        image: String,
        source: Object,
    },
    data() {
        return {
            isShowMemberInfo: false,
            memberViewd: {
                id: "",
                fullname: "",
            }
        };
    },
    methods: {
        click() {
            // this.$emit("click", this.source);
            this.memberViewd = {
                id: this.source.id,
                fullname: this.source.fullname,
                gender: this.source.gender
            }
            this.isShowMemberInfo = true;
        },
        closeMemberInfo() {
            this.isShowMemberInfo = false;
        },
    },
};
</script>

<style lang="scss" scoped>
.vue-family-card {
    text-align: center;
    width: 100px;
    &__image {
        display: block;
        width: 100px;
        height: 100px;
        margin-bottom: 16px;
        background-position: 50%;
        background-size: cover;
        background-color: #dedede;
    }
    &__name {
        font-weight: 600;
        a {
            color: #000;
            text-decoration: none;
        }
    }
}
</style>
