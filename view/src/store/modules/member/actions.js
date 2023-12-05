export default {
    async addMember(context, payload) {
        let apiUrl = (await context.rootGetters.getApiUrl) + "member" + "/add";

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + context.rootGetters.getToken,
            },
            body: JSON.stringify({
                family_id: payload.family_id,
                fullname: payload.fullname,
                gender: payload.gender,
                parent: payload.parent,
                spouse: payload.spouse,
                children: payload.children,
            }),
        });

        const responseData = await response.json();

        if (!response.ok) {
            let errorMessage = "Có lỗi xảy ra, không thể thêm thành viên!";
            if (responseData.errors && responseData.errors.length > 0) {
                errorMessage = responseData.errors[0].msg;
            } else if (responseData.message) {
                errorMessage = responseData.message;
            }
            const error = new Error(errorMessage);
            throw error;
        }
    },

    async updateMemberDetail(context, payload) {
        let apiUrl =
            (await context.rootGetters.getApiUrl) +
            "memberdetail" +
            "/add/" +
            payload.member_id;
        console.log(apiUrl);
        const response = await fetch(apiUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + context.rootGetters.getToken,
            },
            body: JSON.stringify({
                fullname: payload.fullname,
                gender: payload.gender,
                date_of_birth: payload.date_of_birth,
                place_of_birth: payload.place_of_birth,
                date_of_death: payload.date_of_death,
                place_of_death: payload.place_of_death,
                images: payload.images,
                background_desc: payload.background_desc,
            }),
        });

        const responseData = await response.json();

        if (!response.ok) {
            let errorMessage =
                "Có lỗi xảy ra, không thể cập nhật thông tin thành viên!";
            if (responseData.errors && responseData.errors.length > 0) {
                errorMessage = responseData.errors[0].msg;
            } else if (responseData.message) {
                errorMessage = responseData.message;
            }
            const error = new Error(errorMessage);
            throw error;
        }

        return responseData.memberDetail;
    },
};
