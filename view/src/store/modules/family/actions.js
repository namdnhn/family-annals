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

        const families = responseData.families

        return families
    },
    async getFamiliesBySearch(context, payload) {
        let apiUrl =
            (await context.rootGetters.getApiUrl) + "search" + "?text=" + payload;

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

        const families = responseData.families

        return families
    }
};
