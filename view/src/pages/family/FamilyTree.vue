<template>
    <main class="w-full pt-16 lg:pt-20">
        <div
            class="w-full bg-slate-200 px-20 py-10 flex items-center justify-center flex-col gap-8"
        >
            <h1
                class="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-sky-900 font-bold"
            >
                Dòng họ Nguyễn
            </h1>
            <img
                src="../../assets/images/logo.png"
                alt="family logo"
                class="h-24 w-24"
            />
            <p
                class="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-sky-900 font-semibold"
            >
                19 thành viên
            </p>
            <div
                class="grid grid-cols-3 gap-10 text-xs sm:text-sm md:text-base lg:text-lg"
            >
                <span
                    class="text-center bg-indigo-300 px-4 py-2 rounded-lg text-sky-900 font-bold hover:cursor-pointer hover:bg-indigo-400 hover:text-sky-950"
                    :class="
                        mode.info
                            ? 'bg-indigo-400 text-sky-950 hover:cursor-default'
                            : ''
                    "
                    @click="switchMode('info')"
                    >Thông tin dòng họ</span
                >
                <span
                    class="text-center bg-indigo-300 px-4 py-2 rounded-lg text-sky-900 font-bold hover:cursor-pointer hover:bg-indigo-400 hover:text-sky-950"
                    :class="
                        mode.tree
                            ? 'bg-indigo-400 text-sky-950 hover:cursor-default'
                            : ''
                    "
                    @click="switchMode('tree')"
                    >Cây gia phả</span
                >
                <span
                    class="text-center bg-indigo-300 px-4 py-2 rounded-lg text-sky-900 font-bold hover:cursor-pointer hover:bg-indigo-400 hover:text-sky-950"
                    :class="
                        mode.contribute
                            ? 'bg-indigo-400 text-sky-950 hover:cursor-default'
                            : ''
                    "
                    @click="switchMode('contribute')"
                    >Đóng góp</span
                >
            </div>
        </div>

        <!-- mode view info  -->
        <div></div>

        <!-- mode view tree  -->
        <div
            id="app"
            v-if="mode.tree"
            class="bg-gray-50 flex flex-col gap-4 items-center py-4"
        >
            <!-- <button
                class="py-2 px-4 bg-green-400 rounded-xl font-bold text-sky-900 hover:bg-green-500 hover:text-sky-950"
            >
                Khởi tạo cây gia phả
            </button> -->
            <section
                class="px-4 py-2 border rounded-xl border-green-500"
                v-if="tree.length === 0"
            >
                <form
                    @submit.prevent="handleSubmit"
                    class="grid grid-cols-2 gap-4"
                >
                    <!-- fullname  -->
                    <div class="flex flex-col gap-1">
                        <h1
                            class="text-xs sm:text-sm md:text-base lg:text-lg text-sky-900 italic"
                        >
                            Thông tin cá nhân
                        </h1>
                        <div class="flex justify-between items-center gap-2">
                            <label for="user_fullname">Họ và tên:</label>
                            <input
                                type="text"
                                placeholder=""
                                id="user_fullname"
                                class="border px-2 py-1 rounded-lg"
                                v-model="user_fullname"
                            />
                        </div>
                    </div>

                    <!-- parent info  -->
                    <div class="flex flex-col gap-1">
                        <h1
                            class="text-xs sm:text-sm md:text-base lg:text-lg text-sky-900 italic"
                        >
                            Bố
                        </h1>
                        <div
                            v-for="(p, index) in parent"
                            :key="index"
                            class="flex items-center justify-between gap-2"
                        >
                            <div
                                class="flex justify-between items-center gap-2"
                            >
                                <label :for="'parent_fullname' + index"
                                    >Họ và tên:</label
                                >
                                <input
                                    type="text"
                                    placeholder=""
                                    :id="'parent_fullname' + index"
                                    class="border px-2 py-1 rounded-lg"
                                    v-model="p.fullname"
                                />
                                <font-awesome-icon
                                    icon="fa-solid fa-xmark"
                                    class="text-red-500 hover:cursor-pointer"
                                    @click="removeParent(index)"
                                />
                            </div>
                        </div>
                        <span
                            @click="addParent"
                            class="px-2 py-1 bg-green-300 max-w-fit rounded-lg font-semibold text-sky-900 hover:cursor-pointer hover:bg-green-400"
                            >Thêm</span
                        >
                    </div>

                    <!-- spouse info  -->
                    <div class="flex flex-col gap-1">
                        <h1
                            class="text-xs sm:text-sm md:text-base lg:text-lg text-sky-900 italic"
                        >
                            Vợ
                        </h1>
                        <div
                            v-for="(s, index) in spouse"
                            :key="index"
                            class="flex items-center justify-between gap-2"
                        >
                            <div
                                class="flex justify-between items-center gap-2"
                            >
                                <label :for="'spouse_fullname' + index"
                                    >Họ và tên:</label
                                >
                                <input
                                    type="text"
                                    placeholder=""
                                    :id="'spouse_fullname' + index"
                                    class="border px-2 py-1 rounded-lg"
                                    v-model="s.fullname"
                                />
                                <font-awesome-icon
                                    icon="fa-solid fa-xmark"
                                    class="text-red-500 hover:cursor-pointer"
                                    @click="removeSpouse(index)"
                                />
                            </div>
                        </div>
                        <span
                            @click="addSpouse"
                            class="px-2 py-1 bg-green-300 max-w-fit rounded-lg font-semibold text-sky-900 hover:cursor-pointer hover:bg-green-400"
                            >Thêm</span
                        >
                    </div>

                    <!-- children info -->
                    <div class="flex flex-col gap-1">
                        <h1
                            class="text-xs sm:text-sm md:text-base lg:text-lg text-sky-900 italic"
                        >
                            Con
                        </h1>
                        <div
                            v-for="(c, index) in children"
                            :key="index"
                            class="flex flex-col border px-2 py-1 rounded gap-2"
                        >
                            <div
                                class="flex justify-between items-center gap-2"
                            >
                                <label :for="'children_fullname' + index"
                                    >Họ và tên:</label
                                >
                                <input
                                    type="text"
                                    placeholder=""
                                    :id="'children_fullname' + index"
                                    class="border px-2 py-1 rounded-lg"
                                    v-model="c.fullname"
                                />
                            </div>

                            <div
                                class="flex justify-between items-center gap-2"
                            >
                                <label :for="'children_gender' + index"
                                    >Giới tính:</label
                                >
                                <select
                                    name=""
                                    :id="'children_gender' + index"
                                    class="border px-2 py-1"
                                    v-model="children[index].gender"
                                >
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                </select>
                            </div>
                            <font-awesome-icon
                                icon="fa-solid fa-xmark"
                                class="text-red-500 hover:cursor-pointer self-end"
                                @click="removeChildren(index)"
                            />
                        </div>
                        <span
                            @click="addChildren"
                            class="px-2 py-1 bg-green-300 max-w-fit rounded-lg font-semibold text-sky-900 hover:cursor-pointer hover:bg-green-400"
                            >Thêm</span
                        >
                    </div>

                    <p class="col-span-2 text-red-500 text-sm" v-if="!isValid">
                        {{ invalidMessage }}
                    </p>

                    <button
                        class="col-span-2 bg-indigo-400 text-white rounded-md hover:cursor-pointer px-2 py-1 hover:bg-indigo-500"
                    >
                        Tạo
                    </button>
                </form>
            </section>
            <VueFamilyTree
                :tree="tree"
                @card-click="cardClick"
                enable-drag="true"
                :treeHeight="heightOfTree"
            />
        </div>

        <!-- mode contribute  -->
        <div></div>

        <base-spinner v-if="isLoading"></base-spinner>
    </main>
</template>

<script>
import VueFamilyTree from "../../components/tree/VueFamilyTree.vue";
export default {
    components: {
        VueFamilyTree,
    },
    props: ["id"],
    data() {
        return {
            tree: [],
            mode: {
                info: false,
                tree: true,
                contribute: false,
            },
            isLoading: false,
            parent: [],
            spouse: [],
            children: [],
            user_fullname: "",
            user_gender: "Nam",
            isValid: true,
            invalidMessage: "",
            newMember: {
                family_id: "",
                fullname: "",
                gender: "",
                parent: [],
                spouse: [],
                children: [],
            },
        };
    },
    methods: {
        addParent() {
            this.parent.push({
                fullname: "",
                gender: "Nam",
            });
        },
        removeParent(index) {
            this.parent.splice(index, 1);
        },
        addSpouse() {
            this.spouse.push({
                fullname: "",
                gender: "Nữ",
            });
        },
        removeSpouse(index) {
            this.spouse.splice(index, 1);
        },
        addChildren() {
            this.children.push({
                fullname: "",
                gender: "",
            });
        },
        removeChildren(index) {
            this.children.splice(index, 1);
        },
        cardClick(item) {
            // console.log(item);
        },
        switchMode(type) {
            switch (type) {
                case "info":
                    this.mode.info = true;
                    this.mode.tree = false;
                    this.mode.contribute = false;
                    break;
                case "tree":
                    this.mode.info = false;
                    this.mode.tree = true;
                    this.mode.contribute = false;
                    break;
                case "contribute":
                    this.mode.info = false;
                    this.mode.tree = false;
                    this.mode.contribute = true;
                    break;
                default:
                    break;
            }
        },
        calculateHeightOfTree(root) {
            if (!root || !root.children || root.children.length === 0) {
                return 1;
            }
            let height = 0;
            root.children.forEach((child) => {
                height = Math.max(height, this.calculateHeightOfTree(child));
            });
            return height + 1;
        },
        async getFamilyTree() {
            // call api
            try {
                this.isLoading = true;
                const family = await this.$store.dispatch(
                    "family/getFamilyTree",
                    this.$route.params.id
                );
                this.tree.push(family);
            } catch (err) {
                console.log(err);
            }
            this.isLoading = false;
        },
        async handleSubmit() {
            if (!this.validateInital) {
                this.isValid = false;
                return;
            } else {
                this.newMember = {
                    family_id: this.id,
                    fullname: this.user_fullname,
                    gender: this.user_gender,
                };

                if (this.parent.length > 0) {
                    this.newMember.parent = this.parent;
                }

                if (this.spouse.length > 0) {
                    this.newMember.spouse = this.spouse;
                }

                if (this.children.length > 0) {
                    this.newMember.children = this.children;
                }
                console.log(this.newMember);
                try {
                    this.isLoading = true;
                    await this.$store.dispatch(
                        "member/addMember",
                        this.newMember
                    );
                    console.log("add mem succesfully");
                    this.getFamilyTree();
                } catch (err) {
                    console.log(err);
                }
                this.resetForm();
            }
        },
        resetForm() {
            (this.parent = []),
                (this.spouse = []),
                (this.children = []),
                (this.user_fullname = ""),
                (this.user_gender = "Nam"),
                (this.isValid = true),
                (this.invalidMessage = ""),
                (this.newMember = {
                    family_id: "",
                    fullname: "",
                    gender: "",
                    parent: [],
                    spouse: [],
                    children: [],
                });
        },
    },
    computed: {
        heightOfTree() {
            return this.calculateHeightOfTree(this.tree[0]) * 250;
        },
        validateInital() {
            if (this.user_fullname === "") {
                this.invalidMessage = "Vui lòng điền đầy đủ thông tin cá nhân!";
                return false;
            }
            if (this.parent.length > 0) {
                for (let i = 0; i < this.parent.length; i++) {
                    if (this.parent[i].fullname === "") {
                        this.invalidMessage =
                            "Vui lòng điền đầy đủ thông tin bố!";
                        return false;
                    }
                }
            }
            if (this.spouse.length > 0) {
                for (let i = 0; i < this.spouse.length; i++) {
                    if (this.spouse[i].fullname === "") {
                        this.invalidMessage =
                            "Vui lòng điền đầy đủ thông tin vợ!";
                        return false;
                    }
                }
            }
            if (this.children.length > 0) {
                if (this.spouse.length === 0) {
                    this.invalidMessage = "Vui lòng điền đầy đủ thông tin vợ!";
                    return false;
                }
                for (let i = 0; i < this.children.length; i++) {
                    if (
                        this.children[i].fullname === "" ||
                        this.children[i].gender === ""
                    ) {
                        this.invalidMessage =
                            "Vui lòng điền đầy đủ thông tin con!";
                        return false;
                    }
                }
            }
            return true;
        },
    },
    mounted() {
        this.getFamilyTree();
    },
};
</script>
