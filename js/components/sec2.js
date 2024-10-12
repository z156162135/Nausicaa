import { particlesBg, step2Event } from "../tool.js";
import { EventInfo } from "../lightbox.js";
const sec2 = {
	props: {
		mobile: {
			type: Boolean,
			default: false
		},
		mobileType: {
			type: String,
			default: "google"
		}
	},
	setup(props) {
		let swiper2 = Vue.ref(null);
		let cards = Vue.ref(null);
		let container = Vue.ref(null);
		let currentEvent = Vue.ref(1);
		let eventCardData = Vue.ref(step2Event);
		let goSlide = (index) => {
			currentEvent.value = index;
			swiper2.value.slideTo(index);
		};
		let eventPop = (data, type) => {
			EventInfo(data, type);
		};
		let browserWidth = 1920;
		let startWidth = 120;
		let endWidth = 1400;
		let targetBrowserWidth = Vue.ref(document.documentElement.clientWidth);
		let scrollEvent = Vue.ref(null);
		window.addEventListener("resize", function () {
			targetBrowserWidth.value = document.documentElement.clientWidth;
			scrollEvent.value.refresh();
		});
		let eventCardDataFilter = Vue.computed(() => {
			let now = new Date().getTime();
			return eventCardData.value.filter((v, i) => {
				return now >= new Date(v.open).getTime() && now <= new Date(v.close).getTime();
			});
		});
		let scrollStart = Vue.computed(() => {
			return "-=" + parseInt((startWidth / browserWidth) * targetBrowserWidth.value) + "px";
		});
		let scrollEnd = Vue.computed(() => {
			return "+=" + parseInt((endWidth / browserWidth) * targetBrowserWidth.value) + "px";
		});
		Vue.nextTick(() => {
			particlesBg("sec2");
			if (props.mobile) {
				swiper2.value = new Swiper(".sec2-swiper-wrap", {
					navigation: {
						nextEl: ".swiper-button-next",
						prevEl: ".swiper-button-prev"
					}
				});
				swiper2.value.on("slideChange", function (swiper) {
					currentEvent.value = swiper.activeIndex + 1;
				});
			} else {
				let trigger = ".sec2-container";
				cards.value = document.querySelectorAll("[data-sec2-card]");
				container.value = document.querySelector(trigger);
				function scrollCardsAnimation() {
					var t1 = gsap.timeline();
					var je = "power1.out";
					return t1
						.from(
							".sec2-title",
							{
								x: "0",
								opacity: 0,
								duration: 6
							},
							"-=1"
						)
						.to(
							".sec2-wrap",
							{
								x: "0",
								duration: 6
							},
							"-=2.7"
						)
						.to(
							cards.value[0],
							{
								rotateY: -180,
								ease: je,
								duration: 6
							},
							"-=2.7"
						)
						.to(
							cards.value[1],
							{
								x: "0%",
								ease: je,
								duration: 6
							},
							"-=4.4"
						)
						.to(
							cards.value[1],
							{
								rotateY: -180,
								ease: je,
								duration: 6
							},
							"-=2.0"
						)
						.to(
							cards.value[2],
							{
								x: "0%",
								ease: je,
								duration: 6
							},
							"-=3.5"
						)
						.to(
							cards.value[2],
							{
								rotateY: -180,
								ease: je,
								duration: 6
							},
							"-=2.0"
						)
						.to(
							cards.value[3],
							{
								x: "0%",
								ease: je,
								duration: 6
							},
							"-=3.0"
						)
						.to(
							cards.value[3],
							{
								rotateY: -180,
								ease: je,
								duration: 6
							},
							"-=1.3"
						);
				}
				scrollEvent.value = ScrollTrigger.create({
					trigger: trigger,
					animation: scrollCardsAnimation(),
					// scroller: ".scroll-container",
					start: scrollStart.value,
					end: scrollEnd.value,
					scrub: true,
					pin: true,
					// pinType: "transform",
					onEnter: function () {
						let h1 = $(".sec1").outerHeight(true);
						let h2 = $(".sec2").outerHeight(true);
						$(".sec3").attr("style", "--h:" + parseInt(h1 + h2));
					}
					// markers: true
				});
				// scrollEvent.value.config({
				// 	// default is "resize,visibilitychange,DOMContentLoaded,load" so we can remove "resize" from the list:
				// 	autoRefreshEvents: "DOMContentLoaded,load"
				// });
				gsap.registerPlugin(ScrollTrigger);
			}
		});
		return { goSlide, currentEvent, eventPop, eventCardDataFilter };
	},
	template: `
    <div class="sec sec2" id="sec2">
        <div class="sec2-container">
		<div class="sec2-title"></div>
            <div class="sec2-tab">
                <div class="sec2-tab__title" :class="[currentEvent == index+1?'active':'']" v-for="(event,index) in eventCardDataFilter" @click="goSlide(index)">{{event.title}}</div>
            </div>
            <div class="sec2-wrap">
                <div class="sec2-swiper-wrap">
                    <div class="sec2-content swiper-wrapper" data-sec2-content>
                        <div class="sec2-card" :class="[mobile?'swiper-slide':'']" v-for="(event,index) in eventCardDataFilter" :data-event="event.id" data-sec2-card @click="eventPop(event,mobileType)">
                            <div class="sec2-card__title">{{event.title}}</div>
                            <div class="sec2-card__item">
                                <div class="sec2-card__item-front">
                                    <div class="sec2-card__item-front--img1"><div class="blue"></div></div>
                                    <div class="sec2-card__item-front--img2"></div>
                                </div>
                                <div class="sec2-card__item-back"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
            </div>
        </div>
    </div>`
};

export default sec2;