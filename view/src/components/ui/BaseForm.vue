<template>
    <teleport to="body">
        <div
            v-if="show"
            @click="tryClose"
            class="fixed top-0 left-0 w-full h-screen z-50 backdrop"
        ></div>
        <transition name="dialog">
            <div
                class="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50"
                v-if="show"
            >
                <form
                    @submit.prevent=""
                    class="p-4 flex flex-col gap-4 rounded-lg bg-white max-w-3xl w-full"
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
                            <p>Nguyen Van A</p>
                        </span>

                        <span class="flex items-center gap-2">
                            <label class="text text-sky-900 italic"
                                >Giới tính:
                            </label>
                            <p>Nam</p>
                        </span>

                        <span class="flex items-center gap-2">
                            <label class="text text-sky-900 italic"
                                >Ngày sinh:
                            </label>
                            <p>19/01/1910</p>
                        </span>

                        <span class="flex items-center gap-2">
                            <label class="text text-sky-900 italic"
                                >Nơi sinh:
                            </label>
                            <p>Hà Nội</p>
                        </span>

                        <span class="flex items-center gap-2">
                            <label class="text text-sky-900 italic"
                                >Ngày mất:
                            </label>
                            <p>19/01/2004</p>
                        </span>

                        <span class="flex items-center gap-2">
                            <label class="text text-sky-900 italic"
                                >Nơi mất:
                            </label>
                            <p>Hà Nội</p>
                        </span>

                        <span class="col-span-2 flex gap-2 max-w-m">
                            <label class="text text-sky-900 italic min-w-fit"
                                >Tiểu sử :
                            </label>
                            <p>
                                It is a long established fact that a reader will
                                be distracted by the readable content of a page
                                when looking at its layout. The point of using
                                Lorem Ipsum is that it has a more-or-less normal
                                distribution of letters, as opposed to using
                                'Content here, content here', making it look
                                like readable English. Many desktop publishing
                                packages and web page editors now use Lorem
                                Ipsum as their default model text, and a search
                                for 'lorem ipsum' will uncover many web sites
                                still in their infancy. Various versions have
                                evolved over the years, sometimes by accident,
                                sometimes on purpose (injected humour and the
                                like).
                            </p>
                        </span>

                        <span class="flex items-center gap-1">
                            <label class="text text-sky-900 italic"
                                >Ảnh:
                            </label>
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/1200px-User_icon_2.svg.png"
                                alt="avt"
                                class="h-32 w-32"
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
                                v-model="this.user_fullname"
                            />
                        </span>

                        <span class="flex items-center gap-2">
                            <label class="text text-sky-900 italic" for="gender"
                                >Giới tính:
                            </label>
                            <select
                                name=""
                                id="gender"
                                v-model="this.user_gender"
                                class="border border-green-500 rounded-lg outline-green-700 px-2 py-1"
                            >
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                            </select>
                        </span>

                        <span class="flex items-center gap-2">
                            <label class="text text-sky-900 italic" for="dob"
                                >Ngày sinh:
                            </label>
                            <input
                                type="date"
                                id="dob"
                                class="border border-green-500 rounded-lg outline-green-700 px-2 py-1"
                                v-model="this.date_of_birth"
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
                                v-model="this.place_of_birth"
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
                                v-model="this.date_of_death"
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
                                v-model="this.place_of_death"
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
                                v-model="this.background_desc"
                            ></textarea>
                        </span>

                        <span class="col-span-2 flex items-center gap-2">
                            <label class="text text-sky-900 italic" for="images"
                                >Ảnh:
                            </label>
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
    data() {
        return {
            mode: {
                isView: true,
                isEdit: false,
            },
            editInvalidMessage: "",
            user_fullname: this.fullname,
            user_gender: this.gender,
            date_of_birth: "",
            place_of_birth: "",
            date_of_death: "",
            place_of_death: "",
            images: "",
            background_desc: "",
            isLoading: false,
            imagePreview: null,
            imageFile: null,
            uploadedImage: null,
        };
    },
    emits: ["close"],
    methods: {
        tryClose() {
            this.$emit("close");
        },
        switchMode(type) {
            switch (type) {
                case "view":
                    this.mode.isView = true;
                    this.mode.isEdit = false;
                    break;
                case "edit":
                    this.mode.isView = false;
                    this.mode.isEdit = true;
                    break;
            }
        },
        async handleSubmit() {
            if (!this.validateEditForm) {
                return;
            } else {
                await this.uploadImage();
                try {
                    this.isLoading = true;
                    const formData = {
                        member_id: this.id,
                        fullname: this.user_fullname,
                        gender: this.user_gender,
                        date_of_birth: this.date_of_birth,
                        place_of_birth: this.place_of_birth,
                        date_of_death: this.date_of_death,
                        place_of_death: this.place_of_death,
                        images: this.uploadedImage,
                        background_desc: this.background_desc,
                    };

                    await this.$store.dispatch(
                        "member/updateMemberDetail",
                        formData
                    );

                    console.log("update member detail success");

                    this.resetEditForm();
                } catch (err) {
                    console.log(err);
                }
                this.isLoading = false;
            }
        },
        resetEditForm() {
            (this.editInvalidMessage = ""),
                (this.user_fullname = this.fullname),
                (this.user_gender = this.gender);
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
    },
    computed: {
        validateEditForm() {
            if (this.user_fullname.trim() === "") {
                this.editInvalidMessage = "Vui lòng nhập họ và tên!";
                return false;
            }
            if (this.user_gender.trim() === "") {
                this.editInvalidMessage = "Vui lòng chọn giới tính!";
                return false;
            }
            return true;
        },
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
