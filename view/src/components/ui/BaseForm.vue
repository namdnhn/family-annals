<template>
    <teleport to="body">
        <div
            v-if="show"
            @click="tryClose"
            class="fixed top-0 left-0 w-full h-screen z-50 backdrop"
        ></div>
        <transition name="dialog">
            <div
                class="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 max-h-screen overflow-y-auto"
                v-if="show"
            >
                <form
                    @submit.prevent=""
                    class="p-4 flex flex-col gap-4 rounded-lg bg-white max-w-3xl w-full max-h-screen overflow-y-auto"
                >
                    <div class="flex justify-between items-center">
                        <h1
                            class="text-lg md:text-xl lg:text-2xl font-bold text-sky-900"
                        >
                            Thông tin thành viên
                        </h1>
                        <font-awesome-icon
                            icon="fa-solid fa-xmark"
                            class="text-base md:text-lg lg:text-xl hover:cursor-pointer hover:text-green-500"
                            @click="tryClose"
                        />
                    </div>
                    <div class="flex items-center gap-4">
                        <h2
                            class="text-base bg-gray-300 px-2 py-1 rounded-lg hover:cursor-pointer hover:bg-gray-400 text-sky-800"
                            :class="{
                                'border border-indigo-700 text-sky-900 font-bold':
                                    mode.isView,
                            }"
                            @click="switchMode('view')"
                        >
                            Thông tin chi tiết
                        </h2>
                        <h2
                            class="text-base bg-gray-300 px-2 py-1 rounded-lg hover:cursor-pointer hover:bg-gray-400 text-sky-800"
                            :class="{
                                'border border-indigo-700 text-sky-900 font-bold':
                                    mode.isEdit,
                            }"
                            @click="switchMode('edit')"
                            v-if="admin.includes(userId)"
                        >
                            Chỉnh sửa thông tin chi tiết
                        </h2>
                        <h2
                            class="text-base bg-gray-300 px-2 py-1 rounded-lg hover:cursor-pointer hover:bg-gray-400 text-sky-800"
                            :class="{
                                'border border-indigo-700 text-sky-900 font-bold':
                                    mode.isRelation,
                            }"
                            @click="switchMode('relation')"
                            v-if="admin.includes(userId)"
                        >
                            Thêm quan hệ gia đình
                        </h2>
                    </div>

                    <!-- view info  -->
                    <div class="grid grid-cols-2 gap-3" v-if="mode.isView">
                        <span class="flex items-center gap-2">
                            <label class="text text-sky-900 italic"
                                >Họ và tên:
                            </label>
                            <p>{{ memberDetail.fullname }}</p>
                        </span>

                        <span class="flex items-center gap-2">
                            <label class="text text-sky-900 italic"
                                >Giới tính:
                            </label>
                            <p>{{ memberDetail.gender }}</p>
                        </span>

                        <span class="flex items-center gap-2">
                            <label class="text text-sky-900 italic"
                                >Ngày sinh:
                            </label>
                            <p>{{ memberDetail.date_of_birth }}</p>
                        </span>

                        <span class="flex items-center gap-2">
                            <label class="text text-sky-900 italic"
                                >Nơi sinh:
                            </label>
                            <p>{{ memberDetail.place_of_birth }}</p>
                        </span>

                        <span class="flex items-center gap-2">
                            <label class="text text-sky-900 italic"
                                >Ngày mất:
                            </label>
                            <p>{{ memberDetail.date_of_death }}</p>
                        </span>

                        <span class="flex items-center gap-2">
                            <label class="text text-sky-900 italic"
                                >Nơi mất:
                            </label>
                            <p>{{ memberDetail.place_of_death }}</p>
                        </span>

                        <span class="col-span-2 flex gap-2 max-w-m">
                            <label class="text text-sky-900 italic min-w-fit"
                                >Tiểu sử :
                            </label>
                            <p>
                                {{ memberDetail.background_desc }}
                            </p>
                        </span>

                        <span class="flex items-center gap-2">
                            <label class="text text-sky-900 italic"
                                >Ảnh:
                            </label>
                            <img
                                :src="memberDetail.images"
                                alt="avt"
                                class="h-32 w-32"
                                v-if="memberDetail.images"
                            />
                        </span>
                    </div>

                    <!-- edit info (only admin) -->
                    <div class="grid grid-cols-2 gap-3" v-if="mode.isEdit">
                        <span class="flex items-center gap-2">
                            <label
                                class="text text-sky-900 italic"
                                for="fullname"
                                >Họ và tên:
                            </label>
                            <input
                                type="text"
                                id="fullname"
                                class="border border-green-500 rounded-lg outline-green-700 px-2 py-1"
                                v-model="this.memberDetail.fullname"
                            />
                        </span>

                        <span class="flex items-center gap-2">
                            <label class="text text-sky-900 italic" for="gender"
                                >Giới tính:
                            </label>
                            {{ this.memberDetail.gender }}
                        </span>

                        <span class="flex items-center gap-2">
                            <label class="text text-sky-900 italic" for="dob"
                                >Ngày sinh:
                            </label>
                            <input
                                type="date"
                                id="dob"
                                class="border border-green-500 rounded-lg outline-green-700 px-2 py-1"
                                v-model="this.memberDetail.date_of_birth"
                            />
                        </span>

                        <span class="flex items-center gap-2">
                            <label class="text text-sky-900 italic" for="pob"
                                >Nơi sinh:
                            </label>
                            <input
                                type="text"
                                id="pob"
                                class="border border-green-500 rounded-lg outline-green-700 px-2 py-1"
                                v-model="this.memberDetail.place_of_birth"
                            />
                        </span>

                        <span class="flex items-center gap-2">
                            <label class="text text-sky-900 italic" for="dod"
                                >Ngày mất:
                            </label>
                            <input
                                type="date"
                                id="dod"
                                class="border border-green-500 rounded-lg outline-green-700 px-2 py-1"
                                v-model="this.memberDetail.date_of_death"
                            />
                        </span>

                        <span class="flex items-center gap-2">
                            <label class="text text-sky-900 italic" for="pod"
                                >Nơi mất:
                            </label>
                            <input
                                type="text"
                                id="pod"
                                class="border border-green-500 rounded-lg outline-green-700 px-2 py-1"
                                v-model="this.memberDetail.place_of_death"
                            />
                        </span>

                        <span class="col-span-2 flex gap-2 max-w-m">
                            <label
                                class="text text-sky-900 italic min-w-fit"
                                for="background"
                                >Tiểu sử :
                            </label>
                            <textarea
                                name=""
                                id="background"
                                cols="30"
                                rows="10"
                                class="w-full px-2 py-1 border border-green-500 rounded-lg outline-green-700"
                                v-model="this.memberDetail.background_desc"
                            ></textarea>
                        </span>

                        <span class="col-span-2 flex items-center gap-2">
                            <label class="text text-sky-900 italic" for="images"
                                >Ảnh:
                            </label>
                            <img
                                :src="memberDetail.images"
                                alt="avt"
                                v-if="
                                    memberDetail.images &&
                                    !imagePreview &&
                                    !uploadedImage
                                "
                                class="w-32 h-32"
                            />

                            <div v-if="uploadedImage && !imagePreview" class="">
                                <img
                                    :src="uploadedImage"
                                    alt="logo"
                                    class="w-32 h-32"
                                />
                            </div>

                            <div>
                                <input
                                    type="file"
                                    @change="previewImage"
                                    id="images"
                                    ref="fileInput"
                                />
                                <div
                                    v-if="imagePreview"
                                    class="flex items-center gap-4"
                                >
                                    <img
                                        :src="imagePreview"
                                        alt="Image preview"
                                        class="mt-1 self-center border-2 max-h-48"
                                    />
                                    <button
                                        class="w-6 h-6 flex items-center justify-center text-white rounded-full bg-red-500"
                                        @click="deleteImage"
                                    >
                                        X
                                    </button>
                                </div>
                            </div>
                        </span>

                        <span
                            class="text-red-500 text-sm col-span-2"
                            v-if="editInvalidMessage"
                        >
                            {{ editInvalidMessage }}
                        </span>

                        <span
                            class="bg-green-400 text-sky-900 font-bold p-2 rounded-lg hover:cursor-pointer hover:bg-green-500 hover:text-sky-950 text-xs md:text-sm lg:text-base col-span-2 text-center"
                            @click="handleSubmit"
                        >
                            Xác nhận
                        </span>
                    </div>

                    <!-- add relation  -->
                    <div class="grid grid-cols-2 gap-4" v-if="mode.isRelation">
                        <!-- fullname  -->
                        <div class="flex flex-col gap-1">
                            <h1
                                class="text-xs sm:text-sm md:text-base lg:text-lg text-sky-900 italic"
                            >
                                Thông tin cá nhân
                            </h1>
                            <div class="flex items-center gap-2">
                                <label for="user_fullname">Họ và tên:</label>
                                <input
                                    type="text"
                                    placeholder=""
                                    id="user_fullname"
                                    class="border px-2 py-1 rounded-lg"
                                    v-model="memberInfo.fullname"
                                />
                            </div>
                            <div class="flex items-center gap-2">
                                <label for="user_fullname">Giới tính:</label>
                                <p>{{ memberInfo.gender }}</p>
                            </div>
                        </div>

                        <!-- parent info  -->
                        <div
                            class="flex flex-col gap-1"
                            v-if="
                                memberInfoId.parent.length === 0 &&
                                memberInfo.gender !== 'Nữ'
                            "
                        >
                            <h1
                                class="text-xs sm:text-sm md:text-base lg:text-lg text-sky-900 italic"
                            >
                                Bố
                            </h1>
                            <div
                                v-for="(p, index) in memberInfo.parent"
                                :key="index"
                                class="flex items-center justify-between gap-2"
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
                            <span
                                @click="addParent"
                                class="px-2 py-1 bg-green-300 max-w-fit rounded-lg font-semibold text-sky-900 hover:cursor-pointer hover:bg-green-400"
                                v-if="memberInfo.parent.length === 0"
                                >Thêm</span
                            >
                        </div>

                        <!-- spouse info  -->
                        <div
                            class="flex flex-col gap-1"
                            v-if="memberInfo.gender === 'Nam'"
                        >
                            <h1
                                class="text-xs sm:text-sm md:text-base lg:text-lg text-sky-900 italic"
                            >
                                Vợ
                            </h1>
                            <div
                                v-for="(s, index) in memberInfo.spouse"
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
                        <!-- <div
                            class="flex flex-col gap-1"
                            v-if="memberInfo.gender === 'Nữ'"
                        >
                            <h1
                                class="text-xs sm:text-sm md:text-base lg:text-lg text-sky-900 italic"
                            >
                                Chồng
                            </h1>
                            <div
                                v-for="(s, index) in memberInfo.spouse"
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
                                @click="addHusband"
                                class="px-2 py-1 bg-green-300 max-w-fit rounded-lg font-semibold text-sky-900 hover:cursor-pointer hover:bg-green-400"
                                >Thêm</span
                            >
                        </div> -->

                        <!-- children info -->
                        <div
                            class="flex flex-col gap-1"
                            v-if="memberInfo.gender === 'Nam'"
                        >
                            <h1
                                class="text-xs sm:text-sm md:text-base lg:text-lg text-sky-900 italic"
                            >
                                Con
                            </h1>
                            <div
                                v-for="(c, index) in memberInfo.children"
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
                                        v-model="
                                            memberInfo.children[index].gender
                                        "
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

                        <p
                            class="col-span-2 text-red-500 text-sm"
                            v-if="!isValid"
                        >
                            {{ invalidMessage }}
                        </p>

                        <span
                            class="bg-green-400 text-sky-900 font-bold p-2 rounded-lg hover:cursor-pointer hover:bg-green-500 hover:text-sky-950 text-xs md:text-sm lg:text-base col-span-2 text-center"
                            @click="updateRelation"
                        >
                            Xác nhận
                        </span>
                    </div>
                </form>
                <base-spinner v-if="isLoading"></base-spinner>
            </div>
        </transition>
    </teleport>
</template>

<script>
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import firebase from "../../../services/app";
export default {
    props: {
        show: {
            type: Boolean,
            required: true,
        },
        id: {
            type: String,
            required: true,
        },
        fullname: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            required: true,
        },
    },
    inject: ['family_id'],
    emits: ["update-tree"],
    data() {
        return {
            mode: {
                isView: true,
                isEdit: false,
                isRelation: false,
            },
            editInvalidMessage: "",
            isLoading: false,
            imagePreview: null,
            imageFile: null,
            uploadedImage: null,
            memberDetail: {
                fullname: this.fullname,
                gender: this.gender,
                date_of_birth: "",
                place_of_birth: "",
                date_of_death: "",
                place_of_death: "",
                images: "",
                background_desc: "",
            },
            memberInfo: {
                fullname: this.fullname,
                gender: this.gender,
                parent: [],
                spouse: [],
                children: [],
            },
            memberInfoId: {
                parent: [],
                spouse: [],
                children: [],
            },
            isValid: false,
            invalidMessage: "",
            admin: [],
            userId: ""
        };
    },
    emits: ["close"],
    methods: {
        tryClose() {
            this.$emit("close");
        },
        addParent() {
            this.memberInfo.parent.push({
                fullname: "",
                gender: "Nam",
            });
        },
        removeParent(index) {
            this.memberInfo.parent.splice(index, 1);
            this.memberInfoId.parent.splice(index, 1);
        },
        addSpouse() {
            this.memberInfo.spouse.push({
                fullname: "",
                gender: "Nữ",
            });
        },
        addHusband() {
            this.memberInfo.spouse.push({
                fullname: "",
                gender: "Nam",
            });
        },
        removeSpouse(index) {
            this.memberInfo.spouse.splice(index, 1);
            this.memberInfoId.spouse.splice(index, 1);
        },
        addChildren() {
            this.memberInfo.children.push({
                fullname: "",
                gender: "",
            });
        },
        removeChildren(index) {
            this.memberInfo.children.splice(index, 1);
            this.memberInfoId.children.splice(index, 1);
        },
        switchMode(type) {
            switch (type) {
                case "view":
                    this.mode.isView = true;
                    this.mode.isEdit = false;
                    this.mode.isRelation = false;
                    break;
                case "edit":
                    this.mode.isView = false;
                    this.mode.isEdit = true;
                    this.mode.isRelation = false;
                    break;
                case "relation":
                    this.mode.isView = false;
                    this.mode.isEdit = false;
                    this.mode.isRelation = true;
                    break;
            }
        },
        async handleSubmit() {
            if (!this.validateEditForm) {
                return;
            } else {
                this.isLoading = true;
                await this.uploadImage();
                try {
                    const formData = {
                        member_id: this.id,
                        ...this.memberDetail,
                    };

                    await this.$store.dispatch(
                        "member/updateMemberDetail",
                        formData
                    );

                    console.log("update member detail success");
                    this.$emit("update-tree");

                    this.resetEditForm();
                } catch (err) {
                    console.log(err);
                }
                this.isLoading = false;
            }
        },
        resetEditForm() {
            this.editInvalidMessage = "";
        },
        previewImage(event) {
            const file = event.target.files?.[0];
            if (file) {
                this.imageFile = file;
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.imagePreview = e.target?.result;
                };
                reader.readAsDataURL(file);
            }
        },
        deleteImage() {
            this.imagePreview = null;
            this.imageFile = null;
            this.$refs.fileInput.value = "";
        },
        async uploadImage() {
            return new Promise((resolve, reject) => {
                if (this.imageFile) {
                    const storage = getStorage(firebase);
                    const storageRef = ref(
                        storage,
                        "images/" + this.imageFile.name
                    );

                    const uploadTask = uploadBytesResumable(
                        storageRef,
                        this.imageFile
                    );

                    uploadTask.on(
                        "state_changed",
                        (snapshot) => {
                            const progress =
                                (snapshot.bytesTransferred /
                                    snapshot.totalBytes) *
                                100;
                            console.log("Upload is " + progress + "% done");
                        },
                        (error) => {
                            console.error("Upload failed:", error);
                            reject(error);
                        },
                        () => {
                            getDownloadURL(uploadTask.snapshot.ref).then(
                                (downloadURL) => {
                                    console.log(
                                        "File available at",
                                        downloadURL
                                    );
                                    this.uploadedImage = downloadURL;
                                    this.memberDetail.images = downloadURL;
                                    this.deleteImage();
                                    resolve();
                                }
                            );
                        }
                    );
                } else {
                    resolve();
                }
            });
        },
        async getMemberDetail() {
            try {
                this.isLoading = true;
                this.memberDetail = await this.$store.dispatch(
                    "member/getMemberDetail",
                    {
                        member_id: this.id,
                    }
                );
                console.log("get member detail success");
                console.log(this.memberDetail);
            } catch (err) {
                console.log(err);
            }
            this.isLoading = false;
        },
        async getMember() {
            try {
                const res = await this.$store.dispatch(
                    "member/getMember",
                    this.id
                );
                this.memberInfo = {
                    fullname: res.memberInfo.fullname,
                    gender: res.memberInfo.gender,
                    parent: res.memberInfo.parent,
                    spouse: res.memberInfo.spouse,
                    children: res.memberInfo.children,
                };
                this.memberInfoId = {
                    parent: res.member.parent,
                    spouse: res.member.spouse,
                    children: res.member.children,
                };
            } catch (err) {
                console.log(err);
            }
        },
        async getFamily() {
            try {
                const res = await this.$store.dispatch(
                    "family/getFamily",
                    this.family_id
                );
                this.admin = res.admin
            } catch (err) {
                console.log(err);
            }
        },
        async updateRelation() {
            if (!this.validateRelation) {
                return;
            } else {
                const newParent = [];
                for (let i = 0; i < this.memberInfoId.parent.length; i++) {
                    newParent.push(this.memberInfoId.parent[i]);
                }
                for (
                    let i = this.memberInfoId.parent.length;
                    i < this.memberInfo.parent.length;
                    i++
                ) {
                    newParent.push(this.memberInfo.parent[i]);
                }

                const newChildren = [];
                for (let i = 0; i < this.memberInfoId.children.length; i++) {
                    newChildren.push(this.memberInfoId.children[i]);
                }
                for (
                    let i = this.memberInfoId.children.length;
                    i < this.memberInfo.children.length;
                    i++
                ) {
                    newChildren.push(this.memberInfo.children[i]);
                }

                const newSpouse = [];
                for (let i = 0; i < this.memberInfoId.spouse.length; i++) {
                    newSpouse.push(this.memberInfoId.spouse[i]);
                }
                for (
                    let i = this.memberInfoId.spouse.length;
                    i < this.memberInfo.spouse.length;
                    i++
                ) {
                    newSpouse.push(this.memberInfo.spouse[i]);
                }

                const formData = {
                    member_id: this.id,
                    fullname: this.memberInfo.fullname,
                    gender: this.memberInfo.gender,
                    parent: newParent,
                    spouse: newSpouse,
                    children: newChildren,
                };

                try {
                    this.isLoading = true;
                    await this.$store.dispatch("member/updateMember", formData);
                    console.log("update relation success");
                    this.$emit("update-tree");
                    this.isValid = true;
                    this.invalidMessage = "";
                } catch (err) {
                    console.log(err);
                }
                this.isLoading = false;
            }
        },
    },
    computed: {
        validateEditForm() {
            if (this.memberDetail.fullname.trim() === "") {
                this.editInvalidMessage = "Vui lòng nhập họ và tên!";
                return false;
            }
            if (this.memberDetail.gender.trim() === "") {
                this.editInvalidMessage = "Vui lòng chọn giới tính!";
                return false;
            }
            return true;
        },
        validateRelation() {
            if (this.memberInfo.fullname === "") {
                this.invalidMessage = "Vui lòng điền đầy đủ thông tin cá nhân!";
                return false;
            }
            if (this.memberInfo.parent.length > 0) {
                for (let i = 0; i < this.memberInfo.parent.length; i++) {
                    if (this.memberInfo.parent[i].fullname === "") {
                        this.invalidMessage =
                            "Vui lòng điền đầy đủ thông tin bố!";
                        return false;
                    }
                }
            }
            if (this.memberInfo.spouse.length > 0) {
                for (let i = 0; i < this.memberInfo.spouse.length; i++) {
                    if (this.memberInfo.spouse[i].fullname === "") {
                        this.invalidMessage =
                            "Vui lòng điền đầy đủ thông tin vợ!";
                        return false;
                    }
                }
            }
            if (this.memberInfo.children.length > 0) {
                if (this.memberInfo.spouse.length === 0) {
                    this.invalidMessage =
                        "Vui lòng điền đầy đủ thông tin vợ/chồng!";
                    return false;
                }
                for (let i = 0; i < this.memberInfo.children.length; i++) {
                    if (
                        this.memberInfo.children[i].fullname === "" ||
                        this.memberInfo.children[i].gender === ""
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
        this.getMemberDetail();
        this.getMember();
        this.getFamily();
        this.userId = localStorage.getItem("userId");
    },
};
</script>

<style scoped>
.backdrop {
    background-color: rgba(0, 0, 0, 0.413);
}

.dialog-enter-from,
.dialog-leave-to {
    opacity: 0;
    transform: scale(0.8);
}

.dialog-enter-to,
.dialog-leave-from {
    opacity: 1;
    transform: scale(1);
}

.dialog-enter-active {
    transition: all 0.3s ease-out;
}

.dialog-leave-active {
    transition: all 0.3s ease-in;
}
</style>
