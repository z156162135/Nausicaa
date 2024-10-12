// type=1 step1
// type=2 step2

// code=1 姝ｅ父闋愮櫥
// code=2 宸茬稉闋愮櫥閬�
const apiRequest = axios.create({
	baseURL: "../../api/Event/E20230606"
});

// 闋愬厛鐧诲叆閫佸ソ绂�
export const AddUserData = (Token) => {
	return apiRequest.post("/AddUserData", {
		Token
	});
};

// 鍙栧緱娲诲嫊鍒嗛
export const GetEventCategory = () => {
	return apiRequest.get("/GetEventCategory");
};

// 鍙栧緱娲诲嫊灏嶆噳鐨刡anner list
export const GetEventBannerList = (seq = 0) => {
	return apiRequest.get(`/GetEventBannerList/${seq}`);
};