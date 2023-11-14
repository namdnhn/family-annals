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
            const error = new Error(
                responseData.errors[0].msg || responseData.message || "Không thể đăng ký, kiểm tra dữ liệu của bạn"
            );
            console.log(error);
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
            const error = new Error(
                responseData.errors[0].msg || responseData.message || "Không thể đăng nhập, kiểm tra dữ liệu của bạn"
            );
            console.log(error);
            throw error;
        }

        context.commit("setUser", {
            token: responseData.token,
            userId: responseData.id,
            expiresIn: responseData.expiresIn,
        });

        const expiresIn = new Date().getTime() + responseData.expiresIn * 1000;

        localStorage.setItem("token", responseData.token);
        localStorage.setItem("userId", responseData.id);
        localStorage.setItem("tokenExpiration", expiresIn);

    },

    async autoLogin(context) {
        console.log("auto login");

        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const tokenExpiration = localStorage.getItem("tokenExpiration");

        const expiresIn = +tokenExpiration - new Date().getTime();

        console.log(expiresIn);

        if (expiresIn < 0) {
            context.dispatch("logout");
            return;
        }

        context.commit("setUser", {
            token: token,
            userId: userId,
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
        localStorage.removeItem("tokenExpiration");
    }
};
