export default {
    async getFamilies(context) {
        let apiUrl =
            (await context.rootGetters.getApiUrl) + "family" + "/getall";

        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const responseData = await response.json();

        if (!response.ok) {
            let errorMessage = "Có lỗi xảy ra, không thể lấy dữ liệu!";
            if (responseData.errors && responseData.errors.length > 0) {
                errorMessage = responseData.errors[0].msg;
            } else if (responseData.message) {
                errorMessage = responseData.message;
            }
            const error = new Error(errorMessage);
            throw error;
        }

        const families = responseData.families;

        return families;
    },
    async getFamiliesBySearch(context, payload) {
        let apiUrl =
            (await context.rootGetters.getApiUrl) +
            "search" +
            "?text=" +
            payload;

        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const responseData = await response.json();

        if (!response.ok) {
            let errorMessage = "Có lỗi xảy ra, không thể lấy dữ liệu!";
            if (responseData.errors && responseData.errors.length > 0) {
                errorMessage = responseData.errors[0].msg;
            } else if (responseData.message) {
                errorMessage = responseData.message;
            }
            const error = new Error(errorMessage);
            throw error;
        }

        const families = responseData.families;

        return families;
    },
    async getFamilyTree(context, id) {
        let apiUrl =
            (await context.rootGetters.getApiUrl) + "family" + "/get/" + id;

        console.log(apiUrl);
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const responseData = await response.json();

        if (!response.ok) {
            let errorMessage = "Có lỗi xảy ra, không thể lấy dữ liệu!";
            if (responseData.errors && responseData.errors.length > 0) {
                errorMessage = responseData.errors[0].msg;
            } else if (responseData.message) {
                errorMessage = responseData.message;
            }
            const error = new Error(errorMessage);
            throw error;
        }

        return responseData.familyTree;
    },
    async getFamily(context, id) {
        let apiUrl =
            (await context.rootGetters.getApiUrl) + "family" + "/get/" + id;

        console.log(apiUrl);
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const responseData = await response.json();

        if (!response.ok) {
            let errorMessage = "Có lỗi xảy ra, không thể lấy dữ liệu!";
            if (responseData.errors && responseData.errors.length > 0) {
                errorMessage = responseData.errors[0].msg;
            } else if (responseData.message) {
                errorMessage = responseData.message;
            }
            const error = new Error(errorMessage);
            throw error;
        }

        return responseData.family;
    },
    
    async createFamily(context, payload) {
        let apiUrl = (await context.rootGetters.getApiUrl) + "family" + "/add";

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + context.rootGetters.getToken,
            },
            body: JSON.stringify({
                name: payload.name,
                admin: payload.admin,
                background: payload.background,
                logo: payload.logo,
            }),
        });

        const responseData = await response.json();

        if (!response.ok) {
            let errorMessage = "Có lỗi xảy ra, không thể tạo dòng họ!";
            if (responseData.errors && responseData.errors.length > 0) {
                errorMessage = responseData.errors[0].msg;
            } else if (responseData.message) {
                errorMessage = responseData.message;
            }
            const error = new Error(errorMessage);
            throw error;
        }
    },
};
