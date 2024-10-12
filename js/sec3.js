import { particlesBg, CanvasSprite } from "../tool.js";
import { GetEventCategory, GetEventBannerList } from "../api.js";
import { MessageLB } from "../lightbox.js";
// MessageLB("SDSDSDSD");
const sec3 = {
	props: {
		mobile: {
			type: Boolean,
			default: false
		},
		anim: {
			type: Boolean,
			default: false
		}
	},
	setup(props, { emit }) {
		let swiper3 = Vue.ref(null);
		let currentTab = Vue.ref(1);
		let tabList = Vue.ref([]);
		let eventContent = Vue.ref([]);
		let loading = Vue.ref(true);
		let sec3Title = Vue.ref(null);
		let handleTab = (seq) => {
			if (seq == currentTab.value) {
				return;
			}
			currentTab.value = seq;
			loading.value = true;
			emit("showLoading", true);
			GetEventBannerList(seq).then((res) => {
				let { Code, ListData, Message, Url } = res.data;
				if (Code != 1) {
					emit("showLoading", false);
					MessageLB(Message, Url);
					return;
				}

				eventContent.value = [...ListData];
				Vue.nextTick(() => {
					loading.value = false;
					swiper3.value = new Swiper(".sec3-flim-swiper", {
						effect: "fade",
						navigation: {
							nextEl: ".sec3-swiper-button-next",
							prevEl: ".sec3-swiper-button-prev"
						},
						pagination: {
							el: ".sec3-swiper-pagination",
							clickable: true
						}
					});
				});
				emit("showLoading", false);
			});
		};
		Vue.nextTick(() => {
			particlesBg("sec3");
			sec3Title.value = new CanvasSprite($(".sec3-title__canvas"), 15, 60);
			Promise.allSettled([sec3Title.value.PreLoad("https://tw.hicdn.beanfun.com/beanfun/GamaWWW/MapleStory/Event/E20230606/assets/css/images/sec3-title/", "sec3-title_00")]).then((res) => {
				sec3Title.value.Run();
			});
		});

		Vue.watch(
			() => props.anim,
			(first, second) => {
				sec3Title.value.Run();
			}
		);

		Vue.onMounted(() => {
			// emit("showLoading", true);
			GetEventCategory()
				.then((res) => {
					let { Code, ListData, Message, Url } = res.data;
					if (Code != 1) {
						// emit("showLoading", false);
						MessageLB(Message, Url);
						return;
					}
					if (ListData.length) {
						let total = Math.ceil(ListData.length / 4);
						currentTab.value = ListData[0].Seq;
						for (let i = 0; i < total; i++) {
							tabList.value.push(ListData.slice(4 * i, 4 * (i + 1)));
						}
						return GetEventBannerList(ListData[0].Seq);
					} else {
						// emit("showLoading", false);
						return false;
					}
				})
				.then((res) => {
					if (res) {
						let { Code, ListData, Message, Url } = res.data;
						if (Code != 1) {
							// emit("showLoading", false);
							MessageLB(Message, Url);
							return;
						}
						eventContent.value = [...ListData];
						loading.value = false;
						swiper3.value = new Swiper(".sec3-flim-swiper", {
							effect: "fade",
							navigation: {
								nextEl: ".sec3-swiper-button-next",
								prevEl: ".sec3-swiper-button-prev"
							},
							pagination: {
								el: ".sec3-swiper-pagination",
								clickable: true
							}
						});
					}
				})
				.catch(() => {
					// emit("showLoading", false);
				});
		});
		return {
			handleTab,
			currentTab,
			tabList,
			eventContent,
			loading
		};
	},
	template: `<div class="sec sec3" id="sec3">
    <div class="sec3-meteor sec3-meteor1"></div>
    <div class="sec3-meteor sec3-meteor2"></div>
    <div class="sec3-meteor sec3-meteor3"></div>
    <div class="sec3-title" :class="[anim?'anim':'']">
		<canvas class="sec3-title__canvas" width="1200" height="200"></canvas>
	</div>
    <div class="sec3-content">
        <div class="sec3-flim-tab-box" v-if="tabList">
            <div class="sec3-flim-tab" v-for="(tabs,i) in tabList">
                <a href="javascript:;" class="sec3-flim-tab__btn" :class="[currentTab === tab.Seq?'active':'','sec3-flim-tab__btn-'+i+j]" @click="handleTab(tab.Seq)" v-for="(tab,j) in tabs"><span>{{tab.EventName}}</span></a>
            </div>
        </div>
        <div class="sec3-flim-box">
            <div class="sec3-flim-swiper-box">
                <div class="sec3-flim-swiper" :class="[loading?'loading':'']" v-if="tabList.length">
                    <div class="sec3-flim-wrapper swiper-wrapper">
                        <div class="sec3-flim-slide swiper-slide" v-for="event in eventContent">
                            <div class="sec3-flim-slide__source" style="--color: blue">
                                <img v-if="event.ImageUrl" :src="event.ImageUrl" alt="" />
                                <iframe v-if="event.YoutubeID" width="640" height="360" :src="'https://www.youtube.com/embed/'+event.YoutubeID+'?autoplay=1&mute=1'" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                            </div>
                            <div class="sec3-flim-slide__info">{{event.Description}}</div>
                            <a :href="event.MoreUrl" class="sec3-flim-slide__btn" target="_blank" v-if="event.MoreUrl">鐬В鏇村</a>
                        </div>
                    </div>
                    <div v-if="eventContent.length > 1" class="sec3-swiper-pagination"></div>
                    <div v-if="eventContent.length > 1" class="sec3-swiper-button-prev"></div>
                    <div v-if="eventContent.length > 1" class="sec3-swiper-button-next"></div>
                </div>
				<div class="sec3-flim-comming" v-else></div>
            </div>
        </div>
    </div>
</div>`
};

export default sec3;