<template>
    <main class="pt-16 lg:pt-20">
        <div
            class="w-full bg-gray-50 p-20 flex items-center justify-center flex-col gap-8"
        >
            <h1
                class="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-sky-900 font-bold"
            >
                Family Annals
            </h1>
            <p
                class="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-sky-900 font-semibold"
            >
                Khám phá gia phả dòng họ
            </p>
        </div>
        <div class="flex pb-20">
            <!-- Search bar  -->
            <div class="basis-1/3 px-4 py-2 border flex flex-col gap-4">
                <h1
                    class="text-sm sm:text-base md:text-lg lg:text-xl text-sky-900 font-semibold mb-2 flex items-center gap-2"
                >
                    <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
                    Tìm kiếm
                </h1>
                <input
                    type="text"
                    placeholder="Tên dòng họ..."
                    class="px-4 py-2 border border-green-500 rounded-full w-full"
                    v-model="searchByName"
                />
                <div>
                    <h2
                        class="text-xs sm:text-sm md:text-base lg:text-lg text-sky-900 flex items-center gap-2 font-medium"
                    >
                        <font-awesome-icon icon="fa-solid fa-filter" /> Bộ lọc
                        <p
                            class="ml-2 text-gray-600 text-base italic hover:cursor-pointer"
                            @click="clearFilter"
                        >
                            Xóa
                        </p>
                    </h2>

                    <ul>
                        <li class="flex items-center gap-2">
                            <label for="quantity">Số lượng thành viên</label>
                            <font-awesome-icon
                                icon="fa-solid fa-arrow-up"
                                class="hover:cursor-pointer"
                                @click="filter_quantity"
                                v-if="members_quantity.filter === 'increase'"
                            />
                            <font-awesome-icon
                                icon="fa-solid fa-arrow-down"
                                class="hover:cursor-pointer"
                                @click="filter_quantity"
                                v-if="members_quantity.filter === 'decrease'"
                            />

                            <input
                                type="radio"
                                id="quantity"
                                name="filter"
                                :checked="members_quantity.selected"
                                @click="checkedInput('quantity')"
                            />
                        </li>

                        <li class="flex items-center gap-2">
                            <label for="name">A - Z</label>
                            <font-awesome-icon
                                icon="fa-solid fa-arrow-up"
                                class="hover:cursor-pointer"
                                @click="filter_name"
                                v-if="family_name.filter === 'increase'"
                            />
                            <font-awesome-icon
                                icon="fa-solid fa-arrow-down"
                                class="hover:cursor-pointer"
                                @click="filter_name"
                                v-if="family_name.filter === 'decrease'"
                            />
                            <input
                                type="radio"
                                id="name"
                                name="filter"
                                :checked="family_name.selected"
                                @click="checkedInput('name')"
                            />
                        </li>

                        <li class="flex items-center gap-2">
                            <label for="time">Mới nhất</label>
                            <font-awesome-icon
                                icon="fa-solid fa-arrow-up"
                                class="hover:cursor-pointer"
                                @click="filter_time"
                                v-if="created_time.filter === 'increase'"
                            />
                            <font-awesome-icon
                                icon="fa-solid fa-arrow-down"
                                class="hover:cursor-pointer"
                                @click="filter_time"
                                v-if="created_time.filter === 'decrease'"
                            />
                            <input
                                type="radio"
                                id="time"
                                name="filter"
                                :checked="created_time.selected"
                                @click="checkedInput('time')"
                            />
                        </li>
                    </ul>
                </div>

                <button
                    class="px-4 py-2 bg-green-300 text-sky-900 font-semibold rounded-xl hover:bg-green-400 hover:cursor-pointer hover:text-sky-950"
                    @click="handleSearch"
                >
                    Tìm kiếm
                </button>
            </div>

            <!-- Result bar  -->
            <div class="basis-2/3 border px-4 py-2 flex flex-col gap-4">
                <p
                    class="text-xs md:text-sm lg:text-base text-sky-900 font-semibold mb-2"
                >
                    {{ families.length }} kết quả
                </p>
                <family-card
                    v-for="family in families"
                    :key="family.id"
                    :id="family.id"
                    :members_quantity="family.members.length"
                    :name="family.name"
                ></family-card>
            </div>
        </div>
    </main>
    <base-spinner v-if="isLoading"></base-spinner>
</template>

<script>
import FamilyCard from "../../components/family/FamilyCard.vue";
export default {
    components: {
        FamilyCard,
    },
    data() {
        return {
            members_quantity: {
                filter: "increase",
                selected: false,
            },
            family_name: {
                filter: "increase",
                selected: false,
            },
            created_time: {
                filter: "increase",
                selected: false,
            },
            families: [],
            searchByName: "",
            isLoading: false,
        };
    },
    methods: {
        filter_quantity() {
            if (this.members_quantity.filter === "increase") {
                this.members_quantity.filter = "decrease";
            } else {
                this.members_quantity.filter = "increase";
            }
        },
        filter_name() {
            if (this.family_name.filter === "increase") {
                this.family_name.filter = "decrease";
            } else {
                this.family_name.filter = "increase";
            }
        },
        filter_time() {
            if (this.created_time.filter === "increase") {
                this.created_time.filter = "decrease";
            } else {
                this.created_time.filter = "increase";
            }
        },
        checkedInput(type) {
            switch (type) {
                case "quantity":
                    this.members_quantity.selected = true;
                    this.family_name.selected = false;
                    this.created_time.selected = false;
                    break;
                case "name":
                    this.members_quantity.selected = false;
                    this.family_name.selected = true;
                    this.created_time.selected = false;
                    break;
                case "time":
                    this.members_quantity.selected = false;
                    this.family_name.selected = false;
                    this.created_time.selected = true;
                    break;
            }
        },
        clearFilter() {
            this.members_quantity.filter = "increase";
            this.family_name.filter = "increase";
            this.created_time.filter = "increase";
            this.members_quantity.selected = false;
            this.family_name.selected = false;
            this.created_time.selected = false;
            this.searchByName = "";
        },
        async getFamilies() {
            try {
                this.isLoading = true;
                this.families = await this.$store.dispatch(
                    "family/getFamilies"
                );
                console.log("get all family success");
            } catch (err) {
                console.log(err);
            }
            this.isLoading = false;
        },
        async getFamiliesBySearch() {
            if (this.searchByName.trim() !== "") {
                try {
                    this.isLoading = true;
                    this.families = await this.$store.dispatch(
                        "family/getFamiliesBySearch",
                        this.searchByName
                    );
                    console.log("get families by search name success");
                } catch (err) {
                    console.log(err);
                }
            }
            this.isLoading = false;
        },
        async handleSearch() {
            if (this.searchByName.trim() !== "") {
                await this.getFamiliesBySearch();
            } else {
                await this.getFamilies();
            }
            if (this.members_quantity.selected) {
                if (this.members_quantity.filter === "increase") {
                    this.families.sort((a, b) => {
                        return a.members.length - b.members.length;
                    });
                } else {
                    this.families.sort((a, b) => {
                        return b.members.length - a.members.length;
                    });
                }
            } else if (this.family_name.selected) {
                if (this.family_name.filter === "increase") {
                    this.families.sort((a, b) => {
                        return a.name.localeCompare(b.name);
                    });
                } else {
                    this.families.sort((a, b) => {
                        return b.name.localeCompare(a.name);
                    });
                }
            } else if (this.created_time.selected) {
                if (this.created_time.filter === "increase") {
                    this.families.reverse();
                }
            }
            console.log("handle search success");
        },
    },
    mounted() {
        this.getFamilies();
    },
};
</script>
