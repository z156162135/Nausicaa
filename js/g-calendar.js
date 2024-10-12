!(function (a) {
	var b = /iPhone/i,
		c = /iPod/i,
		d = /iPad/i,
		e = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i,
		f = /Android/i,
		g = /(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i,
		h = /(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i,
		i = /Windows Phone/i,
		j = /(?=.*\bWindows\b)(?=.*\bARM\b)/i,
		k = /BlackBerry/i,
		l = /BB10/i,
		m = /Opera Mini/i,
		n = /(CriOS|Chrome)(?=.*\bMobile\b)/i,
		o = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i,
		p = new RegExp("(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)", "i"),
		q = function (a, b) {
			return a.test(b);
		},
		r = function (a) {
			var r = a || navigator.userAgent,
				s = r.split("[FBAN");
			if (("undefined" != typeof s[1] && (r = s[0]), (s = r.split("Twitter")), "undefined" != typeof s[1] && (r = s[0]), (this.apple = { phone: q(b, r), ipod: q(c, r), tablet: !q(b, r) && q(d, r), device: q(b, r) || q(c, r) || q(d, r) }), (this.amazon = { phone: q(g, r), tablet: !q(g, r) && q(h, r), device: q(g, r) || q(h, r) }), (this.android = { phone: q(g, r) || q(e, r), tablet: !q(g, r) && !q(e, r) && (q(h, r) || q(f, r)), device: q(g, r) || q(h, r) || q(e, r) || q(f, r) }), (this.windows = { phone: q(i, r), tablet: q(j, r), device: q(i, r) || q(j, r) }), (this.other = { blackberry: q(k, r), blackberry10: q(l, r), opera: q(m, r), firefox: q(o, r), chrome: q(n, r), device: q(k, r) || q(l, r) || q(m, r) || q(o, r) || q(n, r) }), (this.seven_inch = q(p, r)), (this.any = this.apple.device || this.android.device || this.windows.device || this.other.device || this.seven_inch), (this.phone = this.apple.phone || this.android.phone || this.windows.phone), (this.tablet = this.apple.tablet || this.android.tablet || this.windows.tablet), "undefined" == typeof window)) return this;
		},
		s = function () {
			var a = new r();
			return (a.Class = r), a;
		};
	"undefined" != typeof module && module.exports && "undefined" == typeof window ? (module.exports = r) : "undefined" != typeof module && module.exports && "undefined" != typeof window ? (module.exports = s()) : "function" == typeof define && define.amd ? define("isMobile", [], (a.isMobile = s())) : (a.isMobile = s());
})(this);
(function (exports) {
	var MS_IN_MINUTES = 60 * 1000;
	var CONFIG = {
		selector: ".g-calendar",
		duration: 60,
		autoDetectDevice: false,
		texts: {
			title: "行事曆提醒",
			download: "g-calendar.ics",
			google: "Google 活動行事曆提醒",
			ios: "IOS 活動行事曆提醒",
			outlook: "Outlook 活動行事曆提醒",
			ienoblob: "Sorry, your browser does not support downloading Calendar events."
		}
	};
	var calendarData = {
		google: "",
		ios: "",
		outlook: ""
	};
	var ieCanDownload = "msSaveOrOpenBlob" in window.navigator;
	var ieMustDownload = /\b(MSIE |Trident.*?rv:|Edge\/)(\d+)/.exec(navigator.userAgent);
	var calendarGenerators = {
		google: function (event) {
			var startTime, endTime;
			startTime = formatTime(event.start);
			endTime = formatTime(event.end);
			var href = encodeURI(["https://calendar.google.com/calendar/render", "?action=TEMPLATE", "&text=" + (event.title || ""), "&dates=" + (startTime || ""), "/" + (endTime || ""), "&details=" + (event.description || ""), "&location=" + (event.address || "")].join(""));
			calendarData.google = href;
			return href;
		},
		ics: function (event) {
			var startTime, endTime;
			startTime = formatTime(event.start);
			endTime = formatTime(event.end);
			var cal = ["BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT", "URL:" + document.URL, "DTSTART:" + (startTime || ""), "DTEND:" + (endTime || ""), "SUMMARY:" + (event.title || ""), "DESCRIPTION:" + (event.description || ""), "LOCATION:" + (event.address || ""), "UID:" + (event.id || "") + "-" + document.URL, "END:VEVENT", "END:VCALENDAR"].join("\n");

			var href = encodeURI("data:text/calendar;charset=utf8," + cal);
			calendarData.ics = href;
			calendarData.ios = href;
			calendarData.outlook = href;
			calendarData.cal = cal;
			return href;
		},
		ios: function (event) {
			return this.ics(event);
		},
		outlook: function (event) {
			return this.ics(event);
		}
	};
	var formatTime = function (date) {
		return date.toISOString().replace(/-|:|\.\d+/g, "");
	};
	var getEndDate = function (start, duration) {
		return new Date(start.getTime() + duration * MS_IN_MINUTES);
	};
	var escapeJSValue = function (text) {
		return text
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/\"/g, "&quot;")
			.replace(/\'/g, "\\'")
			.replace(/(\r?\n|\r)/gm, "\\n");
	};
	var generateMarkup = function (params, calendars) {
		if (params.data.elm.getElementsByClassName("g-calendar-google")[0]) {
			if (calendars.google) {
				params.data.elm.getElementsByClassName("g-calendar-google")[0].href = calendars.google;
			} else {
				params.data.elm.getElementsByClassName("g-calendar-google")[0].style.display = "none";
			}
		}
		if (params.data.elm.getElementsByClassName("g-calendar-outlook")[0]) {
			if (calendars.outlook) {
				if (ieMustDownload) {
					params.data.elm.getElementsByClassName("g-calendar-outlook")[0].addEventListener("click", function () {
						ieDownloadCalendar(escapeJSValue(calendarData.cal));
					});
				} else {
					params.data.elm.getElementsByClassName("g-calendar-outlook")[0].href = calendars.outlook;
				}
			} else {
				params.data.elm.getElementsByClassName("g-calendar-outlook")[0].style.display = "none";
			}
		}
		if (params.data.elm.getElementsByClassName("g-calendar-ios")[0]) {
			if (calendars.ios) {
				params.data.elm.getElementsByClassName("g-calendar-ios")[0].href = calendars.ios;
			} else {
				params.data.elm.getElementsByClassName("g-calendar-ios")[0].style.display = "none";
			}
		}
	};

	var generateCalendar = function (event) {
		var useragent = navigator.userAgent;
		var reg = /BeanGo/gi;
		var google = "";
		var ios = "";
		var outlook = "";
		if (event.autoDetectDevice == "true") {
			if (!isMobile.any) {
				google = calendarGenerators.google(event);
				outlook = calendarGenerators.outlook(event);
			} else {
				if (useragent.indexOf("BeanGo") > -1 || reg.test(useragent)) {
					google = calendarGenerators.google(event);
					outlook = calendarGenerators.outlook(event);
					ios = calendarGenerators.ios(event);
				} else {
					if (isMobile.android.device) {
						google = calendarGenerators.google(event);
						outlook = calendarGenerators.outlook(event);
						ios = calendarGenerators.ios(event);
					}
					if (isMobile.apple.device) {
						if (useragent.match("CriOS")) {
							google = calendarGenerators.google(event);
						} else {
							ios = calendarGenerators.ios(event);
							google = calendarGenerators.google(event);
						}
					}
				}
			}
		} else {
			google = calendarGenerators.google(event);
			outlook = calendarGenerators.outlook(event);
			ios = calendarGenerators.ios(event);
		}

		return {
			google: google,
			ios: ios,
			outlook: outlook
		};
	};
	var validParams = function (params) {
		return params.data !== undefined && params.data.start !== undefined && (params.data.end !== undefined || params.data.allday !== undefined);
	};
	var parseCalender = function (elm) {
		var data = {},
			node;
		elm.setAttribute("data-init", 1);
		data.elm = elm;
		var cls = elm.className
			.split(" ")
			.filter(function (v) {
				return v != "calendar-box";
			})
			.join(" ");
		cls ? (data.cls = cls) : (data.cls = "");

		node = elm.getAttribute("autoDetectDevice");
		if (node) data.autoDetectDevice = node;

		node = elm.getAttribute("begin");
		if (node) data.start = new Date(node);

		node = elm.getAttribute("end");
		if (node) data.end = new Date(node);

		node = elm.getAttribute("duration");
		if (node) data.duration = 1 * node;

		node = elm.getAttribute("allday");
		if (node) data.allday = true;

		node = elm.getAttribute("title");
		if (node) data.title = node;

		node = elm.getAttribute("description");
		if (node) data.description = node;

		node = elm.getAttribute("address");
		if (node) data.address = node;
		if (!data.address) {
			node = elm.getAttribute("location");
			if (node) data.address = node;
		}

		node = elm.getAttribute("title");
		if (node) {
			data.download = node;
			CONFIG.texts.download = node + ".ics";
		}

		cal = createCalendar({ data: data });
		return cal;
	};
	exports.ieDownloadCalendar = function (cal) {
		if (ieCanDownload) {
			var blob = new Blob([cal], { type: "text/calendar" });
			window.navigator.msSaveOrOpenBlob(blob, CONFIG.texts.download);
		}
	};
	exports.createCalendar = function (params) {
		return addToCalendar(params);
	};

	exports.addToCalendar = function (params) {
		if (params instanceof HTMLElement) {
			return parseCalender(params);
		}
		if (params instanceof NodeList) {
			var success = params.length > 0;
			Array.prototype.forEach.call(params, function (node) {
				if (!node.getAttribute("data-init")) {
					success = success && addToCalendar(node);
				}
			});
			return success;
		}
		if (!validParams(params)) {
			return;
		}
		return generateMarkup(params, generateCalendar(params.data));
	};
	exports.calendarData = calendarData;
	exports.calendarInit = function () {
		addToCalendar(document.querySelectorAll(CONFIG.selector));
	};
	var target = document.documentElement || document.body;
	if (window.MutationObserver || window.WebKitMutationObserver) {
		var observer = new MutationObserver(function (mutations) {
			for (var i = 0; i < mutations.length; i++) {
				for (var j = 0; j < mutations[i].addedNodes.length; j++) {
					if (!(mutations[i].addedNodes[j] instanceof HTMLElement)) continue;
					if (mutations[i].addedNodes[j].children.length) {
						for (var k = 0; k < mutations[i].addedNodes[j].children.length; k++) {
							if (mutations[i].addedNodes[j].children[k].classList.contains("g-calendar")) {
								calendarInit();
							}
						}
					} else {
						if (mutations[i].addedNodes[j].classList.contains("g-calendar")) {
							calendarInit();
						}
					}
				}
			}
		});
		observer.observe(target, {
			childList: true,
			subtree: true,
			characterDataOldValue: false
		});
	} else {
		target.addEventListener("DOMSubtreeModified", function () {
			calendarInit();
		});
	}
})(this);
