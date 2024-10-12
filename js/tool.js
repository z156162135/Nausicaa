export const endEvent = "2023/6/20 00:00";
export const removeCalenderTime = "2023/6/20 12:00";
export const surveyCake = "https://survey.beanfun.com/s/0DGl3";
export const step2Event = [
	{
		id: 1,
		title: "鍗¤帀鐨勬梾绋�",
		info: "鏂拌伔妤€堝崱鑾夈€夊腑鎹茬櫥鍫达紝蹇締浜彈鍏ㄦ柊鍐掗毆鍚э紒",
		link: "https://tw-event.beanfun.com/MapleStory/eventad/EventAD.aspx?EventADID=9402",
		img: "https://tw.hicdn.beanfun.com/beanfun/GamaWWW/MapleStory/Event/E20230606/assets/css/images/sec2/sec2-pop3.png",
		yt: "eFHwK1ikRdc",
		show: "2023/6/20 10:00",
		open: "2023/6/6 10:00",
		close: "2023/9/19 23:59",
		calender: {
			text: "7/5 鍏ㄦ柊鑱锋キ-鍗¤帀锛屽腑鎹茬櫥鍫达紒",
			begin: "2023/7/5 14:00",
			end: "2023/7/5 23:59"
		}
	},
	{
		id: 2,
		title: "绌舵サ鐕冪噿",
		info: "绛夌礆绶�1閫�2锛屽崌绛夐€熷害鐙傞300%锛岀洿琛滾V250锛�",
		link: "https://tw-event.beanfun.com/MapleStory/eventad/EventAD.aspx?EventADID=9403",
		img: "https://tw.hicdn.beanfun.com/beanfun/GamaWWW/MapleStory/Event/E20230606/assets/css/images/sec2/sec2-pop1.png",
		yt: "3xJIaGXDRcE",
		show: "2023/6/20 10:00",
		open: "2023/6/6 10:00",
		close: "2023/9/19 23:59",
		calender: {
			text: "6/20 绌舵サ鐕冪噿锛岀瓑绱氱獊鐮村氨鏄従鍦紒",
			begin: "2023/6/20 10:00",
			end: "2023/6/20 23:59"
		}
	},
	{
		id: 3,
		title: "婧寤�",
		info: "娲诲嫊闄愬畾鍦板湒銆堟韩椁愬怀銆夌啽楝ч枊寮碉紝鍜屽啋闅ぅ浼翠竴璧风洝鎯呮帰绱㈠惂锛�",
		link: "https://tw-event.beanfun.com/MapleStory/eventad/EventAD.aspx?EventADID=9401",
		img: "https://tw.hicdn.beanfun.com/beanfun/GamaWWW/MapleStory/Event/E20230606/assets/css/images/sec2/sec2-pop2.png",
		yt: "",
		show: "2023/6/20 10:00",
		open: "2023/6/6 10:00",
		close: "2023/9/19 23:59",
		calender: {
			text: "6/20 婧寤筹紝鐔遍闁嬪嫉锛�",
			begin: "2023/6/20 10:00",
			end: "2023/6/20 23:59"
		}
	},
	{
		id: 4,
		title: "绗叚椤嗘槦",
		info: "绗叚椤嗘槦绔犵瘈浠诲嫏闁嬫斁锝炵崕鍕佃秴婢庢淳锛岃秺鏃╅枊濮嬮牁瓒婂锛�",
		link: "https://tw-event.beanfun.com/MapleStory/eventad/EventAD.aspx?EventADID=9438",
		img: "https://tw.hicdn.beanfun.com/beanfun/GamaWWW/MapleStory/Event/E20230606/assets/css/images/sec2/sec2-pop6.png",
		yt: "",
		show: "2023/6/20 10:00",
		open: "2023/6/20 10:00",
		close: "2023/9/19 23:59",
		calender: {
			text: "7/5 绗叚椤嗘槦浠诲嫏闁嬫斁锛�",
			begin: "2023/7/5 14:00",
			end: "2023/7/5 23:59"
		}
	}
];

export function loadingShow() {
	$("#loadingProgress").show();
}
// Loading闅辫棌
export function loadingHide() {
	$("#loadingProgress").hide();
}
export function CanvasSprite(target, step, speed) {
	this.imgArr = [];
	this.index = 0;
	this.loop = false;
	this.target = target;
	this.el = null;
	this.step = step;
	this.width = 0;
	this.height = 0;
	this.speed = speed || step / 2;
	this.Init();
}
CanvasSprite.prototype.Init = function () {
	this.el = this.target[0].getContext("2d");
	$(this.el.canvas).addClass("loading");
};
CanvasSprite.prototype.PreLoad = function (path, name = "") {
	var count = 0;
	var _this = this;
	return new Promise((resolve, reject) => {
		for (var i = 0; i < this.step; i++) {
			let numPart = name.substring(name.lastIndexOf("_") + 1);
			let newName = name.replace(numPart, i.toString().padStart(numPart.length, "0"));
			this.imgArr[i] = new Image();
			this.imgArr[i].src = path + newName + ".png";
			this.imgArr[i].onload = function () {
				_this.width = this.width;
				_this.height = this.height;
				++count;
				if (count == _this.step) {
					$(_this.el.canvas).removeClass("loading");
					_this.Draw(0);
					resolve(true);
				}
			};
			this.imgArr[i].onerror = function () {
				++count;
				if (count == _this.step) {
					$(_this.el.canvas).removeClass("loading");
					reject(true);
				}
			};
		}
	});
};
CanvasSprite.prototype.Run = function (callback) {
	clearInterval(this.loop);
	var _this = this;
	this.loop = setInterval(function () {
		if (_this.index > _this.step - 1) {
			_this.index = 0;
			clearInterval(_this.loop);
			if (callback) {
				callback();
			}
		}
		_this.Draw(_this.index);

		_this.index++;
	}, this.speed);
};
CanvasSprite.prototype.Loop = function () {
	cancelAnimationFrame(this.animationFrame);
	const _this = this;
	let then = performance.now();
	const fpsInterval = 1000 / this.speed;

	function animate(now) {
		_this.animationFrame = requestAnimationFrame(animate);

		const elapsed = now - then;

		if (elapsed > fpsInterval) {
			then = now - (elapsed % fpsInterval);

			_this.Draw(_this.index);
			_this.index = (_this.index + 1) % _this.step;
		}
	}

	animate(performance.now());
};
CanvasSprite.prototype.Stop = function () {
	this.index = 0;
	clearInterval(this.loop);
	this.Draw(this.index);
};
CanvasSprite.prototype.Draw = function (index) {
	this.el.clearRect(0, 0, this.width, this.height);
	if (this.imgArr[index].complete) {
		this.el.drawImage(this.imgArr[index], 0, 0);
	}
};
export function particlesBg(id) {
	particlesJS(id, {
		particles: {
			number: {
				value: 40,
				density: {
					enable: false,
					value_area: 0
				}
			},
			color: {
				value: "#fff"
			},
			shape: {
				type: "image", //[image,circle,star...]濡傛灉鏄痠mage浠ヤ笅涓嶇鐢�
				stroke: {
					width: 1, //绛嗙暙
					color: "#f0f" //绛嗙暙椤忚壊
				},
				polygon: {
					nb_sides: 5
				},
				image: {
					src: "https://tw.hicdn.beanfun.com/beanfun/GamaWWW/MapleStory/Event/E20230606/assets/css/images/gold.png",
					width: 28,
					height: 28
				}
			},
			opacity: {
				value: 0.5,
				random: false,
				anim: {
					enable: true,
					speed: 1,
					opacity_min: 0,
					sync: false
				}
			},
			size: {
				value: 5, //鐢㈢敓澶у皬
				random: false, //闅ㄦ
				anim: {
					enable: false, //鐢㈢敓闁冪垗
					speed: 40,
					size_min: 1,
					sync: false
				}
			},
			line_linked: {
				enable: false //鏄惁鐢㈢敓閫ｇ窔
			},
			move: {
				enable: true, //true
				speed: 3, //绉诲嫊閫熷害
				direction: "bottom-top", //绉诲嫊鏂瑰悜
				random: true,
				straight: false, //鏄惁闅ㄨ憲鏂瑰悜鍥哄畾绉诲嫊
				out_mode: "out", //绉诲嫊鍑鸿绐�
				bounce: false,
				attract: {
					enable: false,
					rotateX: 600,
					rotateY: 1200
				}
			}
		},
		interactivity: {
			detect_on: "canvas",
			events: {
				onhover: {
					enable: false
				},
				onclick: {
					enable: false
				},
				resize: true
			},
			modes: {
				repulse: {
					distance: 200,
					duration: 0.4
				},
				remove: {
					particles_nb: 10
				}
			}
		},
		retina_detect: true
	});
}