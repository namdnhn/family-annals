<template>
    <main class="p-4 basis-3/4 flex flex-col gap-4">
        <h1
            class="text-base sm:text-lg md:text-xl lg:text-2xl text-sky-900 font-bold"
        >
            Tạo dòng họ mới
        </h1>

        <form
            @submit.prevent="handleSubmit"
            class="border grid grid-cols-2 px-4 py-4 gap-4 rounded-lg overflow-hidden"
        >
            <div class="flex flex-col gap-2">
                <div class="flex items-center gap-2">
                    <label for="familyName" class="max-w-fit"
                        >Tên dòng họ
                    </label>
                    <span
                        class="text-red-500 text-sm"
                        v-if="familyName.errorMessage"
                        >{{ familyName.errorMessage }}</span
                    >
                </div>
                <input
                    type="text"
                    id="familyName"
                    placeholder="VD: Dòng họ Nguyễn"
                    class="px-2 py-1 border border-black rounded-xl outline-green-400 w-full"
                    v-model="familyName.value"
                    @input="familyName.errorMessage = ''"
                />
            </div>

            <!-- <div class="grid grid-rows-2">
                <span class="grid grid-cols-2 items-center justify-start">
                    <label for="admin" class="max-w-fit"
                        >Thêm người quản trị:</label
                    >
                    <ul class="flex gap-1 overflow-auto">
                        <li class="flex items-center gap-1">
                            <p
                                class="px-2 bg-green-400 rounded-full text-sky-900"
                            >
                                {{ id }}
                            </p>
                        </li>
                        <li
                            class="flex items-center gap-1"
                            v-for="(p, index) in admin"
                            :key="p"
                        >
                            <p
                                class="px-2 bg-green-400 rounded-full text-sky-900"
                            >
                                {{ p }}
                            </p>
                            <font-awesome-icon
                                icon="fa-solid fa-xmark"
                                class="hover:cursor-pointer"
                                @click="removeAdmin(index)"
                            />
                        </li>
                    </ul>
                </span>
                <div class="flex gap-2 items-center">
                    <input
                        type="text"
                        id="admin"
                        placeholder="Nhập id của người dùng"
                        class="px-2 py-1 border border-black rounded-xl outline-green-400 w-full"
                        v-model="adminInput"
                    />
                    <span
                        class="px-2 py-1 bg-green-400 rounded-xl text-sky-900 hover:cursor-pointer hover:bg-green-500 hover:text-sky-950"
                        @click="addAdmin"
                        >Thêm</span
                    >
                </div>
            </div> -->

            <div class="flex flex-col gap-2">
                <label for="background" class="max-w-fit">Tiểu sử</label>
                <textarea
                    name=""
                    id="background"
                    cols="10"
                    rows="10"
                    class="rounded-lg px-2 py-1 border border-black outline-green-400"
                    v-model="background"
                ></textarea>
            </div>

            <div class="flex flex-col gap-2">
                <label for="logo" id="logo">Logo</label>

                <div>
                    <input
                        type="file"
                        @change="previewImage"
                        id="logo"
                        ref="fileInput"
                    />
                    <div v-if="imagePreview" class="flex items-center gap-4">
                        <img
                            :src="imagePreview"
                            alt="Image preview"
                            class="mt-1 self-center border-2 max-h-48"
                        />
                        <span
                            class="w-6 h-6 flex items-center justify-center text-white rounded-full bg-red-500 hover:cursor-pointer"
                            @click="deleteImage"
                        >
                            X
                        </span>
                    </div>
                </div>
            </div>

            <div class="flex justify-center items-center">
                <button
                    class="px-4 py-2 bg-green-400 rounded-xl font-bold text-sky-900 hover:cursor-pointer hover:bg-green-500 hover:text-sky-950 "
                >
                    Xác nhận
                </button>
            </div>
        </form>
        <base-spinner v-if="isLoading"></base-spinner>
    </main>
</template>

<script>
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import firebase from "../../../../services/app";
export default {
    props: ["id"],
    data() {
        return {
            admin: [],
            adminInput: "",
            imagePreview: null,
            imageFile: null,
            uploadedImage: "",
            familyName: {
                value: "",
                isValid: true,
                errorMessage: "",
            },
            background: "",
            logo: "",
            isLoading: false,
        };
    },
    methods: {
        addAdmin() {
            if (this.adminInput.trim() == "") return;
            this.admin.push(this.adminInput);
            this.adminInput = "";
        },
        removeAdmin(index) {
            this.admin.splice(index, 1);
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
        async handleSubmit() {
            if (this.isValidate) {
                this.admin.push(this.id);
                this.isLoading = true
                await this.uploadImage();
                const formData = {
                    name: this.familyName.value,
                    admin: this.admin,
                    background: this.background,
                    logo: this.uploadedImage,
                };
                try {
                    await this.$store.dispatch("family/createFamily", formData);
                    console.log("create new family successfully");
                    this.resetForm();
                } catch (error) {
                    console.log(error);
                }
                this.isLoading = false;
            }
        },
        resetForm() {
            this.familyName.value = "";
            this.familyName.isValid = true;
            this.familyName.errorMessage = "";
            this.admin = [];
            this.adminInput = "";
            this.background = "";
            this.logo = "";
        },
    },
    computed: {
        isValidate() {
            if (this.familyName.value.trim() == "") {
                this.familyName.isValid = false;
                this.familyName.errorMessage =
                    "Tên dòng họ không được để trống";
            } else {
                this.familyName.isValid = true;
                this.familyName.errorMessage = "";
            }
            return this.familyName.isValid;
        },
    },
};
</script>
