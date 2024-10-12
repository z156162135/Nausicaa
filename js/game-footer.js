gf_imgPath = "https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/script/footer/images/";
gf_stylePath = "https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/script/footer/style/";

//動態引入CSS
var gf_newCssObj = document.createElement('link');
gf_newCssObj.type = 'text/css';
gf_newCssObj.rel = "stylesheet";
gf_newCssObj.href = gf_stylePath + 'UNI-footer.css';
document.head.appendChild(gf_newCssObj);
//Element
var gf_mainTarget = document.getElementById('game-footer');
var gf_UA = navigator.userAgent;

//判斷是否為[行動裝置]
function gf_isMobile() {
	try {
		document.createEvent("TouchEvent");
		return true;
	} catch (e) {
		return false;
	}
}

//判斷是否是為[一版到底]版型
function gf_is750() {
	var mates = document.getElementsByTagName('meta');
	for (var i = 0; i < mates.length; i++) {
		if (mates[i].getAttribute('name') === 'viewport') {
			return mates[i].getAttribute('content').match(/750/) ? true : false;
		}
	}
}

//判斷是否有[BF列](官網頁面)
function gf_isOfficial() {
	//<script type="text/javascript" src="BFActBar.js"></script>
	var scripts = document.getElementsByTagName('script');
	for (var s = 0; s < scripts.length; s++) {
		if (scripts[s].getAttribute('src') !== null && scripts[s].getAttribute('src').match(/BFActBar/)) {
			return true;
		}
	}
}

//設置 Footer 參數
function gf_setOption() {
	//抓取Script tag屬性
	var currentProd = gf_mainTarget.getAttribute('prod');
	var currentTheme = gf_mainTarget.getAttribute('theme');
	var hasGroupLogo = gf_mainTarget.getAttribute('group-logo');
	var showInH5 = gf_mainTarget.getAttribute('show-H5');
	var option = {
		product: currentProd,
		theme: currentTheme,
		hasGroupLogo: JSON.parse(hasGroupLogo),
		showInH5: JSON.parse(showInH5),
		isMobile: gf_isMobile(),
		isOfficial: gf_isOfficial(),
		is750: gf_is750()
	};
	return option;
}

//組合Footer
function gf_componentFooter(option) {
	//頁面在H5內不生成Footer (有showInH5例外)
	if (!option.showInH5) {
		if (/BeanGo/.test(gf_UA)) return;
	}
	
	//html模板，{{名稱}}代表要套入的地方
	var logoArea_html =
		'<div class="logoArea">{{logoLinks}}</div>';
	var copyrightArea_html =
		'<div class="copyrightArea"><p class="m-hide">{{copyrightD}}</p><p class="m-show">{{copyrightM}}</p></div>';
	var gradeArea_html =
		'<div class="gradeArea"><div class="gradeArea__img"><img src="{{gradeImgSrc}}"></div><ul class="gradeArea__list">{{gradeItem}}</ul></div>';
	/*集團LOGO區塊*/
	var groupLogoArea_html = '<div class="groupLogoArea"><a href="https://www.gamania.com/" target="_blank"><img src="https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/images/footer/logos/logo-gamania-g.png"></a></div>';

	var item = gf_jsonData[option.product];
	var theme = option.theme;
	//Copyright年份
	var nowTime = new Date();
	var nowYear = nowTime.getFullYear();

	/*遊戲Logo區塊生成*/
	var logo_links = '';
	for (var l = 0; l < item.logoLink.length; l++) {
		logo_links += '<a href=' + item.logoLink[l] + ' target="_blank" class="logoArea__link"><img src=' + gf_imgPath + item.logoImg[theme][l] + ' alt=""></a>';
	}
	var componentLogoArea = logoArea_html
		.replace("{{logoLinks}}", logo_links);

	/*Copyright區塊生成*/
	var componentCopyrightArea = copyrightArea_html
		.replace("{{copyrightD}}", item.copyright.desktop)
		.replace("{{copyrightM}}", item.copyright.mobile)
		.replace(/CyearS/g, nowYear);

	/*分級區塊生成*/
	var gradeInfo_items = '';
	for (var g = 0; g < item.gradeInfo.length; g++) {
		gradeInfo_items += '<li>' + item.gradeInfo[g] + '</li>';
	}
	var componentGradeArea = gradeArea_html
		.replace("{{gradeImgSrc}}", gf_imgPath + item.gradeImg)
		.replace("{{gradeItem}}", gradeInfo_items);

	/*集團Logo區塊*/
	var componentGroupLogoArea = '';
	if (option.hasGroupLogo) {
		componentGroupLogoArea = groupLogoArea_html;
	}


	//加入其他Class
	var otherClass = [];

	//IE8+9 Hack
	var isIE8 = gf_UA.indexOf('MSIE 8.0');
	var isIE9 = gf_UA.indexOf('MSIE 9.0');
	if (isIE8 > 0) {
		otherClass.push('ie8');
		otherClass.push('ieLet10');
	}
	if (isIE9 > 0) {
		otherClass.push('ieLet10');
	}
	/*bf!遊戲*/
	if (option.product == 'bf!遊戲') {
		otherClass.push('bfgame');
	}
	/*一版到底在手機版時*/
	if (option.is750 && option.isMobile) {
		otherClass.push('vp');
	}
	/*在官網內顯示，加高footer，並且加入集團Logo*/
	if (option.isOfficial) {
		otherClass.push('hasBF');
		componentGroupLogoArea = groupLogoArea_html;
	}

	var componentClass = otherClass.join(' ');

	/*組合Footer*/
	var componentHtml = '<div class="UNI-footer ' + theme + ' ' + componentClass + '"><div class="inner-wrap">' + componentLogoArea + componentCopyrightArea + componentGradeArea + componentGroupLogoArea + '</div></div>';

	//將組合Footer加入至頁面
	if (gf_mainTarget.getAttribute('appendTo') == null) {
		document.body.insertAdjacentHTML('beforeEnd', componentHtml);
	} else {
		var appendTarget = gf_mainTarget.getAttribute('appendTo');
		document.getElementById(appendTarget).insertAdjacentHTML('beforeEnd', componentHtml);
	}
	if(item.gradeImg.indexOf('empty.gif') != -1) document.querySelector('.gradeArea').remove();
}

//各產品資料
var gf_jsonData;
gf_jsonData = {
	"天堂M": {
		"logoImg": {
			"dark": ["logos/logo-gama.png", "logos/logo-ncsoft.png", "logos/logo-beanfun.png"],
			"light": ["logos/logo-gama.png", "logos/logo-ncsoft-w.png", "logos/logo-beanfun-w.png"]
		},
		"logoLink": ["https://www.gamania.com/", "https://global.ncsoft.com/global/", "https://tw.beanfun.com/"],
		"copyright": {
			"desktop": "© CyearS Gamania Digital Entertainment Co., Ltd. All Rights Reserved.<br>© NCSOFT Corporation. Licensed to Gamania All Rights Reserved.",
			"mobile": "© CyearS Gamania Digital Entertainment Co., Ltd. All Rights Reserved.<br>© NCSOFT Corporation. Licensed to Gamania All Rights Reserved."
		},
		"gradeImg": "grade/class_15.gif",
		"gradeInfo": ["本遊戲部份內容涉及暴力、性情節。", "請避免沉迷遊戲。", "本遊戲部份內容需另行支付費用。", "未成年或無行為能力人，需由法定代理人同意後方得使用本遊戲服務。"],
		"favicon": "favicon/icon-LineageM.ico",
	},
	"天堂": {
		"logoImg": {
			"dark": ["logos/logo-gama.png", "logos/logo-ncsoft.png", "logos/logo-beanfun.png"],
			"light": ["logos/logo-gama.png", "logos/logo-ncsoft-w.png", "logos/logo-beanfun-w.png"]
		},
		"logoLink": ["https://www.gamania.com/", "https://global.ncsoft.com/global/", "https://tw.beanfun.com/"],
		"copyright": {
			"desktop": "© CyearS Gamania Digital Entertainment Co., Ltd. All Rights Reserved. <br>© CyearS NCsoft Corporation. All Rights Reserved. <br> Licensed to Gamania Digital Entertainment co., Ltd. the right to publish, distribute and transmit Lineage in Taiwan.",
			"mobile": "© CyearS NCSOFT & Gamania."
		},
		"gradeImg": "grade/class_15.gif",
		"gradeInfo": ["本遊戲部份內容涉及暴力、性情節。", "請避免沉迷遊戲。", "本遊戲部份內容需另行支付費用。", "未成年或無行為能力人，需由法定代理人同意後方得使用本遊戲服務。"]
	},
	"天堂國際服": {
		"logoImg": {
			"dark": ["logos/logo-gama.png", "logos/logo-ncsoft.png", "logos/logo-beanfun.png"],
			"light": ["logos/logo-gama.png", "logos/logo-ncsoft-w.png", "logos/logo-beanfun-w.png"]
		},
		"logoLink": ["https://www.gamania.com/", "https://global.ncsoft.com/global/", "https://tw.beanfun.com/"],
		"copyright": {
			"desktop": "© CyearS Gamania Digital Entertainment Co., Ltd. All Rights Reserved. <br>© CyearS NCsoft Corporation. All Rights Reserved. <br> Licensed to Gamania Digital Entertainment co., Ltd. the right to publish, distribute and transmit Lineage in Taiwan.",
			"mobile": "© CyearS NCSOFT & Gamania."
		},
		"gradeImg": "grade/class_15.gif",
		"gradeInfo": ["本遊戲部份內容涉及暴力、性情節。", "請避免沉迷遊戲。", "本遊戲部份內容需另行支付費用。", "未成年或無行為能力人，需由法定代理人同意後方得使用本遊戲服務。"]
	},
	"天堂免服": {
		"logoImg": {
			"dark": ["logos/logo-gama.png", "logos/logo-ncsoft.png", "logos/logo-beanfun.png"],
			"light": ["logos/logo-gama.png", "logos/logo-ncsoft-w.png", "logos/logo-beanfun-w.png"]
		},
		"logoLink": ["https://www.gamania.com/", "https://global.ncsoft.com/global/", "https://tw.beanfun.com/"],
		"copyright": {
			"desktop": "© CyearS Gamania Digital Entertainment Co., Ltd. All Rights Reserved. <br>© CyearS NCsoft Corporation. All Rights Reserved. <br> Licensed to Gamania Digital Entertainment co., Ltd. the right to publish, distribute and transmit Lineage in Taiwan.",
			"mobile": "© CyearS NCSOFT & Gamania."
		},
		"gradeImg": "grade/class_15.gif",
		"gradeInfo": ["本遊戲部份內容涉及暴力、性情節。", "請避免沉迷遊戲。", "本遊戲部份內容需另行支付費用。", "未成年或無行為能力人，需由法定代理人同意後方得使用本遊戲服務。"]
	},
	"新楓之谷": {
		"logoImg": {
			"dark": ["logos/logo-gama.png", "logos/logo-nexon.png", "logos/logo-beanfun.png"],
			"light": ["logos/logo-gama.png", "logos/logo-nexon-w.png", "logos/logo-beanfun-w.png"]
		},
		"logoLink": ["https://www.gamania.com/", "https://www.nexon.net/", "https://tw.beanfun.com/"],
		"copyright": {
			"desktop": "Copyright © 2003 NEXON Korea Corporation,<br>Licensed to Gamania Digital Entertainment Co., Ltd., in Taiwan.",
			"mobile": "Copyright © 2003 NEXON Korea Corporation,<br>Licensed to Gamania Digital Entertainment Co., Ltd., in Taiwan."
		},
		"gradeImg": "grade/class_12.gif",
		"gradeInfo": ["本遊戲部份內容涉及暴力情節。", "請避免沉迷遊戲。", "本遊戲部份內容需另行支付費用。", "未成年或無行為能力人，需由法定代理人同意後方得使用本遊戲服務。"]
	},
	"絕對武力": {
		"logoImg": {
			"dark": ["logos/logo-gama.png", "logos/logo-nvcso.png", "logos/logo-beanfun.png"],
			"light": ["logos/logo-gama.png", "logos/logo-nvcso-w.png", "logos/logo-beanfun-w.png"]
		},
		"logoLink": ["https://www.gamania.com/", "javascript:;", "https://tw.beanfun.com/"],
		"copyright": {
			"desktop": "Copyright © CyearS NEXON Korea Corporation & Valve Corporation,<br>Licensed to Gamania Digital Entertainment Co., Ltd., in Taiwan.<br>Valve, Counter-Strike and Counter-Strike Online are trademarks,<br>registered trademarks, or applied trademarks of Valve Corporation.",
			"mobile": "Copyright © CyearS NEXON Korea Corporation & Valve Corporation,<br>Licensed to Gamania Digital Entertainment Co., Ltd., in Taiwan.<br>Valve, Counter-Strike and Counter-Strike Online are trademarks,<br>registered trademarks, or applied trademarks of Valve Corporation."
		},
		"gradeImg": "grade/class_15.gif",
		"gradeInfo": ["本遊戲部份內容涉及暴力、性情節。", "請避免沉迷遊戲。", "本遊戲部份內容需另行支付費用。", "未成年或無行為能力人，需由法定代理人同意後方得使用本遊戲服務。"]
	},
	"絕對武力2": {
		"logoImg": {
			"dark": ["logos/logo-gama.png", "logos/logo-nvcso.png", "logos/logo-beanfun.png"],
			"light": ["logos/logo-gama.png", "logos/logo-nvcso-w.png", "logos/logo-beanfun-w.png"]
		},
		"logoLink": ["https://www.gamania.com/", "javascript:;", "https://tw.beanfun.com/"],
		"copyright": {
			"desktop": "Copyright © 2013 NEXON Korea Corporation & Valve Corporation,<br>Licensed to Gamania Digital Entertainment Co., Ltd., in Taiwan.<br>Valve, Counter-Strike and Counter-Strike Online are trademarks,<br>registered trademarks, or applied trademarks of Valve Corporation.",
			"mobile": "Copyright © 2013 NEXON Korea Corporation & Valve Corporation,<br>Licensed to Gamania Digital Entertainment Co., Ltd., in Taiwan.<br>Valve, Counter-Strike and Counter-Strike Online are trademarks,<br>registered trademarks, or applied trademarks of Valve Corporation."
		},
		"gradeImg": "grade/class_15.gif",
		"gradeInfo": ["本遊戲部份內容涉及暴力、性情節。", "請避免沉迷遊戲。", "本遊戲部份內容需另行支付費用。", "未成年或無行為能力人，需由法定代理人同意後方得使用本遊戲服務。"]
	},
	"新瑪奇A": {
		"logoImg": {
			"dark": ["logos/logo-gama.png", "logos/logo-nexon.png", "logos/logo-beanfun.png"],
			"light": ["logos/logo-gama.png", "logos/logo-nexon-w.png", "logos/logo-beanfun-w.png"]
		},
		"logoLink": ["https://www.gamania.com/", "https://www.nexon.net/", "https://tw.beanfun.com/"],
		"copyright": {
			"desktop": "Copyright © 2022 NEXON Korea Corporation,<br>Licensed to Gamania Digital Entertainment Co., Ltd., in Taiwan.",
			"mobile": "Copyright © 2022 NEXON Korea Corporation,<br>Licensed to Gamania Digital Entertainment Co., Ltd., in Taiwan."
		},
		"gradeImg": "grade/class_12.gif",
		"gradeInfo": ["本遊戲部份內容涉及暴力情節。", "請避免沉迷遊戲。", "本遊戲部份內容需另行支付費用。", "未成年或無行為能力人，需由法定代理人同意後方得使用本遊戲服務。"]
	},
	"新瑪奇B": {
		"logoImg": {
			"dark": ["logos/logo-gama.png", "logos/logo-nexon.png", "logos/logo-beanfun.png"],
			"light": ["logos/logo-gama.png", "logos/logo-nexon-w.png", "logos/logo-beanfun-w.png"]
		},
		"logoLink": ["https://www.gamania.com/", "https://www.nexon.net/", "https://tw.beanfun.com/"],
		"copyright": {
			"desktop": "Copyright © 2022 NEXON Korea Corporation,<br>Licensed to Gamania Digital Entertainment Co., Ltd., in Taiwan.",
			"mobile": "Copyright © 2022 NEXON Korea Corporation,<br>Licensed to Gamania Digital Entertainment Co., Ltd., in Taiwan."
		},
		"gradeImg": "grade/class_12.gif",
		"gradeInfo": ["本遊戲部份內容涉及暴力情節。", "請避免沉迷遊戲。", "本遊戲部份內容需另行支付費用。", "未成年或無行為能力人，需由法定代理人同意後方得使用本遊戲服務。"]
	},
	"跑跑卡丁車": {
		"logoImg": {
			"dark": ["logos/logo-gama.png", "logos/logo-nexon.png", "logos/logo-beanfun.png"],
			"light": ["logos/logo-gama.png", "logos/logo-nexon-w.png", "logos/logo-beanfun-w.png"]
		},
		"logoLink": ["https://www.gamania.com/", "https://www.nexon.net/", "https://tw.beanfun.com/"],
		"copyright": {
			"desktop": "Copyright © 2003 NEXON Korea Corporation,<br>Licensed to Gamania Digital Entertainment Co., Ltd., in Taiwan.",
			"mobile": "Copyright © 2003 NEXON Korea Corporation,<br>Licensed to Gamania Digital Entertainment Co., Ltd., in Taiwan."
		},
		"gradeImg": "grade/class_12.gif",
		"gradeInfo": ["本遊戲有戀愛交友情節。", "請避免沉迷遊戲。", "本遊戲部份內容需另行支付費用。", "未成年或無行為能力人，需由法定代理人同意後方得使用本遊戲服務。"]
	},
	"艾爾之光": {
		"logoImg": {
			"dark": ["logos/logo-gama.png", "logos/logo-kog.png", "logos/logo-beanfun.png"],
			"light": ["logos/logo-gama.png", "logos/logo-kog.png", "logos/logo-beanfun-w.png"]
		},
		"logoLink": ["https://www.gamania.com/", "http://www.kog.co.kr/", "https://tw.beanfun.com/"],
		"copyright": {
			"desktop": "© CyearS Gamania Digital Entertainment Co., Ltd. All rights Reserved. <br> Copyright © KOG Corp.",
			"mobile": "© CyearS KOG & Gamania."
		},
		"gradeImg": "grade/class_12.gif",
		"gradeInfo": ["本遊戲部份內容涉及暴力。", "請避免沉迷遊戲。", "本遊戲部份內容需另行支付費用。", "未成年或無行為能力人，需由法定代理人同意後方得使用本遊戲服務。"]
	},
	"爆爆王": {
		"logoImg": {
			"dark": ["logos/logo-gama.png", "logos/logo-nexon.png", "logos/logo-beanfun.png"],
			"light": ["logos/logo-gama.png", "logos/logo-nexon-w.png", "logos/logo-beanfun-w.png"]
		},
		"logoLink": ["https://www.gamania.com/", "https://www.nexon.net/", "https://tw.beanfun.com/"],
		"copyright": {
			"desktop": "Copyright © 2001 NEXON Korea Corporation,<br>Licensed to Gamania Digital Entertainment Co., Ltd., in Taiwan.",
			"mobile": "Copyright © 2001 NEXON Korea Corporation,<br>Licensed to Gamania Digital Entertainment Co., Ltd., in Taiwan."
		},
		"gradeImg": "grade/class_12.gif",
		"gradeInfo": ["本遊戲有戀愛交友情節。", "請避免沉迷遊戲。", "本遊戲部份內容需另行支付費用。", "未成年或無行為能力人，需由法定代理人同意後方得使用本遊戲服務。"]
	},
	"泡泡大亂鬥": {
		"logoImg": {
			"dark": ["logos/logo-gama.png", "logos/logo-nexon.png", "logos/logo-beanfun.png"],
			"light": ["logos/logo-gama.png", "logos/logo-nexon-w.png", "logos/logo-beanfun-w.png"]
		},
		"logoLink": ["https://www.gamania.com/", "https://www.nexon.net/", "https://tw.beanfun.com/"],
		"copyright": {
			"desktop": "Copyright © 2009 NEXON Korea Corporation,<br>Licensed to Gamania Digital Entertainment Co., Ltd., in Taiwan.",
			"mobile": "Copyright © 2009 NEXON Korea Corporation,<br>Licensed to Gamania Digital Entertainment Co., Ltd., in Taiwan."
		},
		"gradeImg": "grade/class_6.gif",
		"gradeInfo": ["本遊戲部份內容涉及暴力情節。", "請避免沉迷遊戲。", "本遊戲部份內容需另行支付費用。", "未成年或無行為能力人，需由法定代理人同意後方得使用本遊戲服務。"]
	},
	"勁舞團": {
		"logoImg": {
			"dark": ["logos/logo-hham.png"],
			"light": ["logos/logo-hham-w.png"]
		},
		"logoLink": ["javascript:;"],
		"copyright": {
			"desktop": "© CyearS HaPod Digital Technology Co., Ltd. All Rights Reserved.<br>COPYRIGHT © HANBITSOFT INC. ALL RIGHTS RESERVED.",
			"mobile": "© HANBITSOFT & HaPod"
		},
		"gradeImg": "grade/class_6.gif",
		"gradeInfo": ["本遊戲部分內容提供虛擬戀愛交友功能。", "請避免沉迷遊戲。", "本遊戲部份內容需另行支付費用。", "未成年或無行為能力人，需由法定代理人同意後方得使用本遊戲服務。"]
	},
	"召喚圖板": {
		"logoImg": {
			"dark": ["logos/logo-gama.png", "logos/logo-gungho2.png", "logos/logo-beanfun.png"],
			"light": ["logos/logo-gama.png", "logos/logo-gungho2-w.png", "logos/logo-beanfun-w.png"]
		},
		"logoLink": ["https://www.gamania.com/", "javascript:;", "https://tw.beanfun.com/"],
		"copyright": {
			"desktop": "© GungHo Online Entertainment, Inc. All Rights Reserved.<br>Licensed to and published by Gamania Digital Entertainment Co., Ltd.",
			"mobile": "© GungHo Online Entertainment, Inc. All Rights Reserved.<br>Licensed to and published by Gamania Digital Entertainment Co., Ltd."
		},
		"gradeImg": "grade/class_6.gif",
		"gradeInfo": ["本遊戲部份內容涉及棋奕娛樂。", "請避免沉迷遊戲。", "不得利用本遊戲進行遊戲賭博或有違反法令之行為 ", "本遊戲部份內容需另行支付費用。", "未成年或無行為能力人，需由法定代理人同意後方得使用本遊戲服務。"],
		"favicon": "favicon/icon-SB-32.ico",
	},
	"發射吧少女": {
		"logoImg": {
			"dark": ["logos/logo-gungHo.png", "logos/logo-cave.png"],
			"light": ["logos/logo-gungHo.png", "logos/logo-cave.png"]
		},
		"logoLink": ["javascript:;", "javascript:;"],
		"copyright": {
			"desktop": "© GungHo Gamania Co., Ltd. All Rights Reserved.<br>© 2015 CAVE Interactive CO., LTD.",
			"mobile": "© GungHo Gamania Co., Ltd. All Rights Reserved.<br>© 2015 CAVE Interactive CO., LTD."
		},
		"gradeImg": "grade/class_12.gif",
		"gradeInfo": ["可愛人物打鬥之非血腥畫面。", "請避免沉迷遊戲。", "本遊戲部份內容需另行支付費用。", "未成年或無行為能力人，需由法定代理人同意後方得使用本遊戲服務。"]
	},
	"魔力寶貝M": {
		"logoImg": {
			"dark": ["logos/logo-gamania.png"],
			"light": ["logos/logo-gamania-w.png"]
		},
		"logoLink": ["https://www.gamania.com/"],
		"copyright": {
			"desktop": "© 2019 Gamania Digital Entertainment Co., Ltd. All Rights Reserved.<br>© SQUARE ENIX (CHINA) CO.,LTD.ALL RIGHTS RESERVED.",
			"mobile": "© 2019 Gamania Digital Entertainment Co., Ltd. All Rights Reserved.<br>© SQUARE ENIX (CHINA) CO.,LTD.ALL RIGHTS RESERVED."
		},
		"gradeImg": "grade/class_12.gif",
		"gradeInfo": ["可愛人物打鬥之非血腥畫面。", "請避免沉迷遊戲。", "本遊戲部份內容需另行支付費用。", "未成年或無行為能力人，需由法定代理人同意後方得使用本遊戲服務。"],
		"favicon": "favicon/icon-CGM.ico",
	},
	"bf!遊戲": {
		"logoImg": {
			"dark": ["logos/logo-gama.png", "logos/logo-beanfun.png"],
			"light": ["logos/logo-gama.png", "logos/logo-beanfun-w.png"]
		},
		"logoLink": ["https://www.gamania.com/", "https://tw.beanfun.com/"],
		"copyright": {
			"desktop": "© CyearS Gamania Digital Entertainment Co., Ltd. All Rights Reserved.",
			"mobile": "© CyearS Gamania Digital Entertainment Co., Ltd. All Rights Reserved."
		},
		"gradeImg": "grade/op.gif",
		"gradeInfo": ""
	},
	"便利商店口袋版": {
		"logoImg": {
			"dark": ["logos/logo-gama.png", "logos/logo-beanfun.png"],
			"light": ["logos/logo-gama.png", "logos/logo-beanfun-w.png"]
		},
		"logoLink": ["https://www.gamania.com/", "https://tw.beanfun.com/"],
		"copyright": {
			"desktop": "© CyearS Gamania Digital Entertainment Co., Ltd. All Rights Reserved.",
			"mobile": "© CyearS Gamania Digital Entertainment Co., Ltd. All Rights Reserved."
		},
		"gradeImg": "grade/class_0.gif",
		"gradeInfo": ["請避免沉迷遊戲。", "本遊戲部份內容需另行支付費用。", "未成年或無行為能力人，需由法定代理人同意後方得使用本遊戲服務。"]
	},
	"小森生活": {
		"logoImg": {
			"dark": ["logos/logo-gungHo.png", "logos/logo-zorro.png"],
			"light": ["logos/logo-gungHo-w.png", "logos/logo-zorro-w.png"]
		},
		"logoLink": ["javascript:;", "javascript:;"],
		"copyright": {
			"desktop": "© GungHo Gamania Co., Ltd. All rights reserved.<br>© 2016 Shanghai Zorro Network Technology Co. Ltd.",
			"mobile": "© GungHo Gamania Co., Ltd. All rights reserved.<br>© 2016 Shanghai Zorro Network Technology Co. Ltd."
		},
		"gradeImg": "grade/class_12.gif",
		"gradeInfo": ["遊戲內容涉及戀愛交友。", "請避免沉迷遊戲。", "本遊戲部份內容需另行支付費用。", "未成年或無行為能力人，需由法定代理人同意後方得使用本遊戲服務。"],
		"favicon": "favicon/icon-komorilife.ico",
	},
	"新龍之谷": {
		"logoImg": {
			"dark": ["logos/logo-gama.png", "logos/logo-shengqu.png", "logos/logo-eyedentity.png", "logos/logo-beanfun.png"],
			"light": ["logos/logo-gama.png", "logos/logo-shengqu-w.png", "logos/logo-eyedentity-w.png", "logos/logo-beanfun-w.png"]
		},
		"logoLink": ["https://www.gamania.com/", "javascript:;", "javascript:;", "https://tw.beanfun.com/"],
		"copyright": {
			"desktop": "© Gamania Digital Entertainment Co.,Ltd. & Eyedentitygames. All Rights Reserved.",
			"mobile": "© Gamania Digital Entertainment Co.,Ltd. & Eyedentitygames. All Rights Reserved."
		},
		"gradeImg": "grade/class_12.gif",
		"gradeInfo": ["本遊戲部份內容涉及暴力情節。", "請避免沉迷遊戲。", "本遊戲部份內容需另行支付費用。", "未成年或無行為能力人，需由法定代理人同意後方得使用本遊戲服務。"]
	},
	"龍之谷新世界": {
		"logoImg": {
			"dark": ["logos/logo-gama.png", "logos/logo-eyedentity.png", "logos/logo-beanfun.png"],
			"light": ["logos/logo-gama.png", "logos/logo-eyedentity-w.png", "logos/logo-beanfun-w.png"]
		},
		"logoLink": ["https://www.gamania.com/", "javascript:;", "https://tw.beanfun.com/"],
		"copyright": {
			"desktop": "© Gamania Digital Entertainment Co.,Ltd. & Eyedentitygames.<br>All Rights Reserved.",
			"mobile": "© Gamania Digital Entertainment Co.,Ltd. & Eyedentitygames.<br>All Rights Reserved."
		},
		"gradeImg": "grade/class_12.gif",
		"gradeInfo": ["本遊戲部份內容涉及暴力情節。", "請避免沉迷遊戲。", "本遊戲部份內容需另行支付費用。", "未成年或無行為能力人，需由法定代理人同意後方得使用本遊戲服務。"],
		"favicon": "favicon/icon-WOD-32.ico",
	},
	"AURORA7": {
		"logoImg": {
			"dark": ["logos/logo-gama.png", "logos/logo-interserv.png", "logos/logo-godsflame.png", "logos/logo-beanfun.png"],
			"light": ["logos/logo-gama.png", "logos/logo-interserv-w.png", "logos/logo-godsflame-w.png", "logos/logo-beanfun-w.png"]
		},
		"logoLink": ["https://www.gamania.com/", "https://www.interserv.com.tw/tw/index.php", "http://www.godsflame.com/", "https://tw.beanfun.com/"],
		"copyright": {
			"desktop": "Copyright © 2019 InterServ International Inc. All Rights Reserved. <br>Developed by Gods Flame Digital Co., Ltd. <br>Licensed to Gamania Digital Entertainment in Taiwan, Hong Kong and Macau.",
			"mobile": "Copyright © 2019 InterServ International Inc. All Rights Reserved. <br>Developed by Gods Flame Digital Co., Ltd. <br>Licensed to Gamania Digital Entertainment in Taiwan, Hong Kong and Macau."
		},
		"gradeImg": "grade/class_12.gif",
		"gradeInfo": ["本遊戲部份內容涉及暴力、性、不當語言情節。", "請避免沉迷遊戲。", "本遊戲部份內容需另行支付費用。", "未成年或無行為能力人，需由法定代理人同意後方得使用本遊戲服務。"],
		"favicon": "favicon/icon-AURORA7.ico",
	},
	"月光雕刻師": {
		"logoImg": {
			"dark": ["logos/logo-gama.png", "logos/logo-kakaogames.png", "logos/logo-XLGAMES.png", "logos/logo-beanfun.png"],
			"light": ["logos/logo-gama.png", "logos/logo-kakaogames-w.png", "logos/logo-XLGAMES.png", "logos/logo-beanfun-w.png"]
		},
		"logoLink": ["https://www.gamania.com/", "https://www.kakaogamescorp.com/", "https://www.xlgames.com/", "https://tw.beanfun.com/"],
		"copyright": {
			"desktop": "Copyright ⓒ Kakao games Corp. Gamania Digital <br>Entertainment Co.<br>ⓒ XLGAMES Inc. Derived from '月光雕刻師' produced by intime.<br>All rights reserved. ",
			"mobile": "Copyright ⓒ Kakao games Corp. Gamania Digital <br>Entertainment Co.<br>ⓒ XLGAMES Inc. Derived from '月光雕刻師' produced by intime.<br>All rights reserved. "
		},
		"gradeImg": "grade/class_12.gif",
		"gradeInfo": ["本遊戲部份內容涉及暴力情節。", "請避免沉迷遊戲。", "本遊戲部份內容需另行支付費用。", "未成年或無行為能力人，需由法定代理人同意後方得使用本遊戲服務。"],
		"favicon": "favicon/icon-moonlight.ico",
	},
	"櫻桃小丸子": {
		"logoImg": {
			"dark": ["logos/logo-gama.png", "logos/logo-beanfun.png"],
			"light": ["logos/logo-gama.png", "logos/logo-beanfun-w.png"]
		},
		"logoLink": ["https://www.gamania.com/", "https://tw.beanfun.com/"],
		"copyright": {
			"desktop": "© S.P/N.A<br>Published by Gamania Digital Entertainment Co.,Ltd in Hong Kong. All rights reserved.",
			"mobile": "© S.P/N.A<br>Published by Gamania Digital Entertainment Co.,Ltd in Hong Kong. All rights reserved."
		},
		"gradeImg": "grade/class_0.gif",
		"gradeInfo": ["此軟體為普遍級，任何年齡皆得使用","本遊戲為免費使用，遊戲內另提供購買虛擬遊戲幣、道具等付費服務","請注意遊戲時間，避免沉迷"],
		"favicon": "favicon/icon-cmclf.ico"
	},
	"櫻桃小丸子EN": {
		"logoImg": {
			"dark": ["logos/logo-gama.png", "logos/logo-beanfun.png"],
			"light": ["logos/logo-gama.png", "logos/logo-beanfun-w.png"]
		},
		"logoLink": ["https://www.gamania.com/", "https://tw.beanfun.com/"],
		"copyright": {
			"desktop": "© S.P/N.A<br>Published by Gamania Digital Entertainment Co.,Ltd in Hong Kong. All rights reserved.",
			"mobile": "© S.P/N.A<br>Published by Gamania Digital Entertainment Co.,Ltd in Hong Kong. All rights reserved."
		},
		"gradeImg": "grade/empty.gif",
		"gradeInfo": [],
		"favicon": "favicon/icon-cmclf.ico"
	},
	"彈射世界": {
		"logoImg": {
			"dark": ["logos/logo-gama.png", "logos/logo-cygames.png", "logos/logo-citail.png", "logos/logo-beanfun.png"],
			"light": ["logos/logo-gama.png", "logos/logo-cygames-w.png", "logos/logo-citail.png", "logos/logo-beanfun-w.png"]
		},
		"logoLink": ["https://www.gamania.com/", "https://www.cygames.co.jp/", "https://citail.jp/", "https://tw.beanfun.com/"],
		"copyright": {
			"desktop": "© Cygames, Inc. / Citail Inc.<br>All Rights Reserved.Published in Taiwan<br>by Gamania Digital Entertainment Co., Ltd.",
			"mobile": "© Cygames, Inc. / Citail Inc.<br>All Rights Reserved.Published in Taiwan<br>by Gamania Digital Entertainment Co., Ltd."
		},
		"gradeImg": "grade/class_12.gif",
		"gradeInfo": ["可愛人物打鬥之非血腥畫面。", "請避免沉迷遊戲。", "本遊戲部份內容需另行支付費用。"],
		"favicon": "icon-WF-32.ico",
	},
	"曖昧瞬間": {
		"logoImg": {
			"dark": ["logos/logo-gungHo.png"],
			"light": ["logos/logo-gungHo-w.png"]
		},
		"logoLink": ["javascript:;"],
		"copyright": {
			"desktop": "©2021 GungHo Gamania Co., Ltd. All rights reserved.",
			"mobile": "©2021 GungHo Gamania Co., Ltd. All rights reserved."
		},
		"gradeImg": "grade/class_12.gif",
		"gradeInfo": ["本軟體因涉及虛擬戀愛，依遊戲軟體分級管理辦法分類為輔12級。", "本遊戲部份內容需另行支付費用。", "請避免沉迷遊戲。"],
		"favicon": "favicon/icon-SMP-32.ico",
	},
};
// 取參數
var gf_option = gf_setOption();
/* favicon */
function gf_setFavicon(option) {
	var item = gf_jsonData[option.product];
	var optionFavicon = '';
	if (!item.favicon) {
		optionFavicon = gf_imgPath + 'favicon/favicon.ico';
	}else{
		optionFavicon = gf_imgPath + item.favicon;
	}
	var newIcon = document.createElement('link');
	newIcon.rel = "shortcut icon";
	// newIcon.href = 'https://tw.hicdn.beanfun.com/beanfun/GamaWWW/LineageM/Web/images/favicon.jpg';
	newIcon.href = optionFavicon;
	document.head.appendChild(newIcon);
}


document.addEventListener("DOMContentLoaded", function (event) {
	gf_componentFooter(gf_option);
	gf_setFavicon(gf_option);
});


function gf_updateFooter(arg){
	document.querySelector('.UNI-footer').remove();
	var myScript = document.querySelector('#game-footer');
	myScript.setAttribute('prod', arg.prod);
	myScript.setAttribute('theme', arg.theme);
	gf_option = gf_setOption();
	gf_setFavicon(gf_option);
	gf_componentFooter(gf_option);
}