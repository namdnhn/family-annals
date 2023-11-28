export default {
    async signup(context, payload) {
        let apiUrl = (await context.rootGetters.getApiUrl) + "auth" + "/signup";

        const response = await fetch(apiUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const responseData = await response.json();

        if (!response.ok) {
            let errorMessage = "Không thể đăng ký, kiểm tra dữ liệu của bạn";
            if (responseData.errors && responseData.errors.length > 0) {
                errorMessage = responseData.errors[0].msg;
            } else if (responseData.message) {
                errorMessage = responseData.message;
            }
            const error = new Error(errorMessage);
            throw error;
        }
    },

    async login(context, payload) {
        let apiUrl = (await context.rootGetters.getApiUrl) + "auth" + "/login";

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const responseData = await response.json();

        if (!response.ok) {
            let errorMessage = "Không thể đăng nhập, kiểm tra dữ liệu của bạn";
            if (responseData.errors && responseData.errors.length > 0) {
                errorMessage = responseData.errors[0].msg;
            } else if (responseData.message) {
                errorMessage = responseData.message;
            }
            const error = new Error(errorMessage);
            throw error;
        }

        console.log(payload.email);

        context.commit("setUser", {
            token: responseData.token,
            userId: responseData.id,
            email: payload.email,
            expiresIn: responseData.expiresIn,
        });

        const expiresIn = new Date().getTime() + responseData.expiresIn * 1000;

        localStorage.setItem("token", responseData.token);
        localStorage.setItem("userId", responseData.id);
        localStorage.setItem("email", payload.email);
        localStorage.setItem("tokenExpiration", expiresIn);
    },

    async autoLogin(context) {
        console.log("auto login");

        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const tokenExpiration = localStorage.getItem("tokenExpiration");
        const email = localStorage.getItem("email");

        const expiresIn = +tokenExpiration - new Date().getTime();

        console.log(expiresIn);

        if (expiresIn < 0) {
            context.dispatch("logout");
            return;
        }

        context.commit("setUser", {
            token: token,
            userId: userId,
            email: email,
            tokenExpiration: tokenExpiration,
        });
    },

    async logout(context) {
        context.commit("setUser", {
            token: null,
            userId: null,
            tokenExpiration: null,
        });

        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("email");
        localStorage.removeItem("tokenExpiration");
    },
};
