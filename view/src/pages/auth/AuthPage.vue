<template>
    <main class="pt-20 h-screen flex items-center justify-center">
        <form
            @submit.prevent="login"
            class="px-20 py-5 bg-white flex flex-col items-center rounded-lg gap-8 border-2 shadow"
            v-if="loginForm"
        >
            <h1 class="xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
                Đăng nhập
            </h1>
            <div class="flex flex-col gap-3 text-xs md:text-sm lg:text-base">
                <div class="flex flex-col gap-1">
                    <label class="max-w-max" for="email">Email</label>
                    <input
                        type="text"
                        id="email"
                        placeholder="Email"
                        class="border border-gray-400 p-2 w-full"
                        v-model="email.value"
                        @input="email.isValid = true"
                    />
                    <span
                        class="text-xs lg:text-sm text-red-500"
                        v-if="!email.isValid"
                        >{{ email.messageInvalid }}</span
                    >
                </div>
                <div class="flex flex-col gap-1">
                    <label class="max-w-max" for="password">Mật khẩu</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Mật khẩu"
                        class="border border-gray-400 p-2 w-full"
                        v-model="password.value"
                        @input="password.isValid = true"
                    />
                    <span
                        class="text-xs lg:text-sm text-red-500"
                        v-if="!password.isValid"
                        >{{ password.messageInvalid }}</span
                    >
                </div>
                <div class="flex items-center gap-1">
                    <input type="checkbox" id="remember" />
                    <label for="remember">Lưu mật khẩu</label>
                </div>
                <button
                    class="bg-green-300 p-2 mt-2 rounded-md hover:cursor-pointer hover:bg-green-400"
                >
                    Đăng nhập
                </button>
            </div>
            <span class="flex gap-1 text-xs md:text-sm lg:text-base"
                >Bạn chưa có tài khoản?
                <p
                    class="text-red-500 italic hover:cursor-pointer hover:text-red-600"
                    @click="swithForm('register')"
                >
                    Đăng ký
                </p></span
            >
        </form>

        <form
            @submit.prevent="register"
            class="px-20 py-5 bg-white flex flex-col items-center rounded-lg gap-8 border-2 shadow"
            v-if="registerForm"
        >
            <h1 class="xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
                Đăng ký
            </h1>
            <div class="flex flex-col gap-3 text-xs md:text-sm lg:text-base">
                <div class="flex flex-col gap-1">
                    <label class="max-w-max" for="email">Email</label>
                    <input
                        type="text"
                        id="email"
                        placeholder="Email"
                        class="border border-gray-400 p-2 w-full"
                        v-model="email.value"
                        @input="email.isValid = true"
                    />
                    <span
                        class="text-xs lg:text-sm text-red-500"
                        v-if="!email.isValid"
                        >{{ email.messageInvalid }}</span
                    >
                </div>
                <div class="flex flex-col gap-1">
                    <label class="max-w-max" for="password">Mật khẩu</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Mật khẩu"
                        class="border border-gray-400 p-2 w-full"
                        v-model="password.value"
                        @input="password.isValid = true"
                    />
                    <span
                        class="text-xs lg:text-sm text-red-500"
                        v-if="!password.isValid"
                        >{{ password.messageInvalid }}</span
                    >
                </div>
                <div class="flex flex-col gap-1">
                    <label class="max-w-max" for="confirm-password"
                        >Nhập lại mật khẩu</label
                    >
                    <input
                        type="password"
                        id="confirm-password"
                        placeholder="Mật khẩu"
                        class="border border-gray-400 p-2 w-full"
                        v-model="confirmPassword.value"
                        @input="confirmPassword.isValid = true"
                    />
                    <span
                        class="text-xs lg:text-sm text-red-500"
                        v-if="!confirmPassword.isValid"
                        >{{ confirmPassword.messageInvalid }}</span
                    >
                </div>
                <div class="flex flex-col">
                    <span class="flex items-center gap-1">
                        <input
                            type="checkbox"
                            id="term"
                            v-model="term.value"
                            @change="term.isValid = true"
                        />
                        <label for="term"
                            >Tôi đồng ý với các điều khoản của MagicPost</label
                        >
                    </span>
                    <span
                        class="text-xs lg:text-sm text-red-500"
                        v-if="!term.isValid"
                        >{{ term.messageInvalid }}</span
                    >
                </div>
                <button
                    class="bg-green-300 p-2 mt-2 rounded-md hover:cursor-pointer hover:bg-green-400"
                >
                    Đăng ký
                </button>
            </div>
            <span class="flex gap-1 text-xs md:text-sm lg:text-base"
                >Bạn đã có tài khoản?
                <p
                    class="text-red-500 italic hover:cursor-pointer hover:text-red-600"
                    @click="swithForm('login')"
                >
                    Đăng nhập
                </p></span
            >
        </form>
        <base-spinner v-if="isLoading"></base-spinner>
        <base-dialog
            :show="!!error.title"
            :title="error.title"
            @close="closeDialog"
        >
            <p>
                {{ error.message }} <br />
                Vui lòng thử lại
            </p>
        </base-dialog>
        <base-dialog :show="!!success" :title="success" @close="closeDialog">
            <p>Bạn có thể sử dụng tài khoản này để đăng nhập vào MagicPost</p>
        </base-dialog>
    </main>
</template>

<script>
export default {
    data() {
        return {
            loginForm: true,
            registerForm: false,
            email: {
                value: "",
                isValid: true,
                messageInvalid: "",
            },
            password: {
                value: "",
                isValid: true,
                messageInvalid: "",
            },
            confirmPassword: {
                value: "",
                isValid: true,
                messageInvalid: "",
            },
            term: {
                value: false,
                isValid: true,
                messageInvalid: "",
            },
            isLoading: false,
            error: {
                title: null,
                message: null,
            },
            success: null,
        };
    },
    methods: {
        swithForm(type) {
            this.resetValidate();

            if (type === "login") {
                this.loginForm = true;
                this.registerForm = false;
            } else {
                this.loginForm = false;
                this.registerForm = true;
            }
        },
        login() {
            if (this.loginValidate) {
                console.log("form login is valid");
            } else {
                console.log("form login is invalid");
            }
        },
        async register() {
            if (this.registerValidate) {
                this.isLoading = true;
                console.log("loading register...");
                const payload = {
                    email: this.email.value,
                    password: this.password.value,
                };
                try {
                    await this.$store.dispatch("signup", payload);
                    console.log("resgister success");
                    this.success = "Đăng ký thành công!";
                    this.resetValidate();
                } catch (error) {
                    this.error.message = error.message;
                    this.error.title = "Đăng ký thất bại!";
                    console.log("resgister fail");
                }
                this.isLoading = false;
            }
        },
        async login() {
            if (this.loginValidate) {
                this.isLoading = true;
                console.log("loading login...");
                const payload = {
                    email: this.email.value,
                    password: this.password.value,
                };
                try {
                    await this.$store.dispatch("login", payload);
                    console.log("login success");
                    this.resetValidate();

                    const redirect = this.$route.query.redirect || "/";
                    this.$router.push(redirect);
                } catch (error) {
                    console.log(error);
                    this.error.message = error.message;
                    this.error.title = "Đăng nhập thất bại!";
                    console.log(error.message);
                    console.log("login fail");
                }
                this.isLoading = false;
            }
        },
        resetValidate() {
            this.email.isValid = true;
            this.email.messageInvalid = "";
            this.email.value = "";
            this.password.isValid = true;
            this.password.messageInvalid = "";
            this.password.value = "";
            this.confirmPassword.isValid = true;
            this.confirmPassword.messageInvalid = "";
            this.confirmPassword.value = "";
            this.term.isValid = true;
            this.term.messageInvalid = "";
            this.term.value = false;
        },
        closeDialog() {
            this.error.title = null;
            this.error.message = null;
            this.success = null;
        },
    },
    computed: {
        registerValidate() {
            //validate email
            const emailRegex =
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (this.email.value.trim() === "") {
                this.email.isValid = false;
                this.email.messageInvalid = "Email không được để trống";
            } else if (!emailRegex.test(this.email.value)) {
                this.email.isValid = false;
                this.email.messageInvalid = "Email không hợp lệ";
            } else {
                this.email.isValid = true;
            }

            //validate password
            if (this.password.value.trim() === "") {
                this.password.isValid = false;
                this.password.messageInvalid = "Mật khẩu không được để trống";
            } else if (this.password.value.trim().length < 6) {
                this.password.isValid = false;
                this.password.messageInvalid =
                    "Mật khẩu phải có ít nhất 6 ký tự";
            } else {
                this.password.isValid = true;
            }

            //validate confirm password
            if (this.confirmPassword.value.trim() === "") {
                this.confirmPassword.isValid = false;
                this.confirmPassword.messageInvalid =
                    "Mật khẩu không được để trống";
            } else if (this.confirmPassword.value.trim().length < 6) {
                this.confirmPassword.isValid = false;
                this.confirmPassword.messageInvalid =
                    "Mật khẩu phải có ít nhất 6 ký tự";
            } else if (
                this.confirmPassword.value.trim() !== this.password.value.trim()
            ) {
                this.confirmPassword.isValid = false;
                this.confirmPassword.messageInvalid = "Mật khẩu không khớp";
                console.log("deo khop");
            } else {
                this.confirmPassword.isValid = true;
            }

            //validate term
            if (!this.term.value) {
                this.term.isValid = false;
                this.term.messageInvalid =
                    "Bạn phải đồng ý với điều khoản của MagicPost";
            } else {
                this.term.isValid = true;
            }

            return (
                this.email.isValid &&
                this.password.isValid &&
                this.confirmPassword.isValid &&
                this.term.isValid
            );
        },
        loginValidate() {
            //validate email
            const emailRegex =
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (this.email.value.trim() === "") {
                this.email.isValid = false;
                this.email.messageInvalid = "Email không được để trống";
            } else if (!emailRegex.test(this.email.value)) {
                this.email.isValid = false;
                this.email.messageInvalid = "Email không hợp lệ";
            } else {
                this.email.isValid = true;
            }

            //validate password
            if (this.password.value.trim() === "") {
                this.password.isValid = false;
                this.password.messageInvalid = "Mật khẩu không được để trống";
            } else if (this.password.value.trim().length < 6) {
                this.password.isValid = false;
                this.password.messageInvalid =
                    "Mật khẩu phải có ít nhất 6 ký tự";
            } else {
                this.password.isValid = true;
            }

            return this.email.isValid && this.password.isValid;
        },
    },
};
</script>
