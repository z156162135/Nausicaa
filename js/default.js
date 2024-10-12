import { endEvent, removeCalenderTime } from "./tool.js";
import { EventInfo, SkillVideo } from "./lightbox.js";
import sec1 from "./components/sec1.js";
import sec2 from "./components/sec2.js";
import sec3 from "./components/sec3.js";
import loading from "./components/loading.js";

if (history.scrollRestoration) {
	history.scrollRestoration = "manual";
}

let app = Vue.createApp({
	setup() {
		let mobile = Vue.ref(false);
		let mobileType = Vue.ref("google");
		let currentPage = Vue.ref("sec1");
		let menuStatus = Vue.ref(false);
		let showLoading = Vue.ref(true);
		let handleCalender = () => {};
		let now = new Date().getTime();
		let end = new Date(endEvent).getTime();
		let event = Vue.ref(true);
		let showCalender = Vue.ref(true);
		let loadRightBar = Vue.ref(true);
		let targetBrowserWidth = Vue.ref(document.documentElement.clientWidth);
		let num = Vue.ref(0);
		let anim = Vue.ref(false);
		let login = Vue.ref(false);
		let account = Vue.ref("");
		let type = Vue.ref(0);
		window.addEventListener("resize", function () {
			targetBrowserWidth.value = document.documentElement.clientWidth;
		});
		let goTop = () => {
			$("body,html").animate(
				{
					scrollTop: 0
				},
				800
			);
		};
		let goPage = (page) => {
			if (document.querySelector(page) === null) {
				return;
			}
			let browserWidth = 1920;
			let tempTop = 0;
			let topBar = $(".top-bar").outerHeight(true);
			if (page == "#sec2" && !mobile.value) {
				tempTop = parseInt((1200 / browserWidth) * targetBrowserWidth.value);
			} else {
				if (mobile.value) {
					tempTop -= topBar;
				} else {
					tempTop = 0;
				}
			}
			menuStatus.value = false;
			$("body,html").animate(
				{
					scrollTop: $(page).offset().top + tempTop
				},
				800
			);
		};
		let handleMenu = (status) => {
			menuStatus.value = status;
		};
		let handleLoading = (data) => {
			showLoading.value = data;
		};
		function scrollTarget(t, target, offset = 0) {
			var offset = offset || 0;
			var data_name;
			target.each(function (i, v) {
				if ($(this).offset().top - offset <= t && $(this).offset().top + $(this).outerHeight() - offset > t) {
					data_name = $(this).attr("id");
					currentPage.value = data_name;
				} else {
					data_name = $(this).attr("id");
				}
			});
		}

		window.addEventListener("scroll", function (e) {
			let top = document.documentElement.scrollTop;
			let sec3Title = $("#sec3").offset().top;
			let tempTop = sec3Title * 0.1;
			if (top + tempTop >= sec3Title) {
				anim.value = true;
			} else {
				anim.value = false;
			}
			scrollTarget(top, $(".sec"), 100);
		});

		if (isMobile.any) {
			mobile.value = true;
			if (isMobile.android.device) {
				mobileType.value = "google";
			}
			if (isMobile.apple.device) {
				mobileType.value = "apple";
			}
		} else {
			mobile.value = false;
			mobileType.value = "google";
		}
		if (now >= end) {
			event.value = false;
		} else {
			event.value = true;
		}
		if (now >= new Date(removeCalenderTime).getTime()) {
			showCalender.value = false;
			loadRightBar.value = false;
		} else {
			showCalender.value = true;
			loadRightBar.value = false;
		}
		gsap.to("html", {
			scrollTop: 0,
			duration: 0
		});

		Vue.onMounted(() => {
			if ($("#Token").val() !== "") {
				login.value = true;
				account.value = $("#GameAccount").val();
			}
			let itemType;
			if (window.sessionStorage.getItem("type")) {
				itemType = window.sessionStorage.getItem("type");
				window.sessionStorage.removeItem("type");
			}
			loadingProgress({
				countFN: function (count, length) {
					num.value = Math.round((count / length) * 100);
				},
				loadedFN: function () {
					setTimeout(() => {
						num.value = 100;
						showLoading.value = false;
						$(".loadingProgress").removeClass("init");
						document.querySelector("html").classList.remove("ovh");
						if (itemType === null) {
						} else {
							if ($("#Token").val() == "") {
							} else {
								type.value = itemType;
							}
						}
					}, 400);
				},
				detectVideo: true,
				autoHide: true
			});
		});
		return {
			mobile,
			goPage,
			handleCalender,
			menuStatus,
			goTop,
			handleCalender,
			currentPage,
			handleMenu,
			showLoading,
			handleLoading,
			mobileType,
			event,
			showCalender,
			loadRightBar,
			num,
			anim,
			login,
			account,
			type
		};
	},
	components: {
		sec1,
		sec2,
		sec3,
		loading
	}
});

app.mount("#app");
