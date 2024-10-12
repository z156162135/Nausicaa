(function(){
	if(window.haveDuplicatedScripts === undefined){
		window.haveDuplicatedScripts = '頁面中如果有重覆的GA_CodeNew.js就不執行囉';


		/******************************* 如果是IE瀏覽器就轉導到下載其它瀏覽器的頁面 *******************************/
		if(!!document.documentMode){
			location.href = 'https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/images/IE/index.html';
		}


		/******************************* GA4和GTM程式 *******************************/
		let Prod='', GA4id='', GTMid='', LocationHref = location.href.toUpperCase();
		let script_list = scriptList();

		document.addEventListener('DOMContentLoaded',() => {
			let $has_jssdk = script_list.some(a => a.indexOf('SDK/BEANFUN.MIN.JS') != -1);
			let $has_web_tracing_sdk = script_list.some(a => a.indexOf('WEB-TRACING-JSSDK/WEB_TRACING_SDK') != -1);
			let $has_jst_beanfuntrace = script_list.some(a => a.indexOf('PROD-BEANFUNTRACE_MAIN.JS') != -1);
			let opid_cookie = getCookie('opid');
			let trackid_cookie = getCookie('web_tracing_id');

			//取得產品列表
			let getProductList = () => {
				return new Promise((resolve, reject) => {
					fetch('https://tw-event.beanfun.com/communication/api/ga4/GetProductList', {
						method: 'GET',
					}).then(res => res.json()).then(res => {
						if(res.Code == 1){
							resolve(res.Data.ProductList);
						}else{
							console.log('SD-GetProductList '+res.Message);
							reject('ErrorOccurred: SD-GetProductList '+res.Message);
						}
					}).catch((err) => {
						reject('ErrorOccurred: SD-GetProductList connection error');
					});
				});
			};

			//取得Openid
			let getBGO_OpenId = () => {
				return new Promise((resolve, reject) => {
					if(!$has_jssdk){
						appendScript('https://chat-content.beanfun.com/beango-static-prod/sdk/beanfun.min.js', () => {
							getBGO_OpenIdFN(resolve, reject);
						}, () => {
							console.log('BGO-beanfun.min.js connection error');
							reject('ErrorOccurred: BGO-beanfun.min.js connection error');
						});
					}else if($has_jssdk && !opid_cookie){
						getBGO_OpenIdFN(resolve, reject);
					}else if($has_jssdk && opid_cookie){
						resolve(opid_cookie);
					}
				});
			};
			function getBGO_OpenIdFN(rs, rj){
				try{
					BGO.check_app_exist((rp) => {
						if(rp.result !== null && rp.result !== undefined && rp.result === "ok"){
							fetch('https://gamesync.beanfun.com/V1.1/BeanGo/GetToken', {
								method: 'GET',
							}).then(res => res.json()).then(res => {
								if(res.Result == 1){
									try{
										BGO.init({
											token: res.ResultData.BGO_Token,
											official_account_id: res.ResultData.BGO_OfficialAccountID
										}, res => { //{status: 'success'} or {status: 'error'}
											if(res.status == 'success'){
												try{
													BGO.get_me_openid_access_token('FFAE33DE-9CF3-4A3C-BB6E-663B914B94BA', '', function(res){ //取得openid_access_token（帶client_id），如果失敗：{error:{num}, message:{str}}
														//console.log('get_me_openid_access_token：'+res.access_token);
														fetch('https://tw-event.beanfun.com/communication/api/ga4/H5AccountVerification/'+res.access_token, {
															method: 'GET',
														}).then(res => res.json()).then(res => {
															if(res.Code == 1){
																rs(res.Data.open_id);
															}else{
																console.log('SD-H5AccountVerification '+res.Message);
																rj('ErrorOccurred: SD-H5AccountVerification '+res.Message);
															}
														}).catch((err) => {
															console.log('SD-H5AccountVerification connection error');
															rj('ErrorOccurred: SD-H5AccountVerification connection error');
														});
													});
												}catch(e){
													console.log(e);
													rj('ErrorOccurred: BGO.get_me_openid_access_token() execution error');
												}
											}else{
												console.log(res.status);
												rj('ErrorOccurred: BGO-'+res.status);
											}
										});
									}catch(e){
										console.log(e);
										rj('ErrorOccurred: BGO.init() execution error');
									}
								}else{
									console.log(res.ResultMessage+','+res.ResultMessageCode);
									rj('ErrorOccurred: PD-'+res.ResultMessage+'('+res.ResultMessageCode+')');
								}
							}).catch((err) => {
								console.log('PD-https://gamesync.beanfun.com/V1.1/BeanGo/GetToken connection failed')
								rj('ErrorOccurred: PD-https://gamesync.beanfun.com/V1.1/BeanGo/GetToken connection failed');
							});
						} else {
							rs('openid_not_supported_in_none_h5_environment');
						}
					});
				}catch(e){
					console.log(e);
					rj('ErrorOccurred: BGO-BGO.check_app_exist() execution error');
				}
			}

			//取得Trackid
			let getTrackId = () => {
				return new Promise((resolve, reject) => {
					if(!$has_web_tracing_sdk && !$has_jst_beanfuntrace){
						appendScript('https://chat-content.beanfun.com/beango-static-prod/web-tracing-jssdk/web_tracing_sdk.prod.js', () => {
							getTrackIdFN(resolve, reject);
						}, () => {
							console.log('Data_Center-web_tracing_sdk.prod.js connection error');
							reject('ErrorOccurred: Data_Center-web_tracing_sdk.prod.js connection error');
						});
					}else if(($has_web_tracing_sdk || $has_jst_beanfuntrace) && !trackid_cookie){
						getTrackIdFN(resolve, reject);
					}else if(($has_web_tracing_sdk || $has_jst_beanfuntrace) && trackid_cookie){
						resolve(trackid_cookie);
					}
				});
			}
			function getTrackIdFN(rs, rj){
				try{
					beanfunWebTraceSDK.status.getTrackId().then((res) => { //沒有失敗訊息所以用try catch
						rs(res);
					});
				}catch(e){
					console.log('BGO-beanfun.min.js load error');
					rj('ErrorOccurred: BGO-getTrackId() execution error\n'+e);
				}
			}

			const promises = [
				getProductList().then(val => val).catch(res => res),
				getBGO_OpenId().then(val => val).catch(res => res),
				getTrackId().then(val => val).catch(res => res)
			];
			Promise.all(promises).then(values => {
				let productList = values[0];
				let openId = values[1];
				let trackId = values[2];

				for(var v of productList){
					if(v.Urls.some(j=>LocationHref.indexOf(j.toUpperCase()) != -1)){
						if(GA4id == '') GA4id = v.GA4;
						if(GTMid == '') GTMid = v.GTM;
					}
				}
				if(GA4id == '') GA4id = 'G-SST23BLT4E';

				// *** GA4程式
				appendScript('https://www.googletagmanager.com/gtag/js?id='+GA4id, () => {
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());
					gtag('config', GA4id, {
						'user_id': '"WEB_OID":"'+openId+'","WEB_Track_ID":"'+trackId+'"',
						'test_key': 'my_test_key'
					});
				});

				// *** GTM程式
				if(GTMid != ''){
					(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
					var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
					j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
					})(window,document,'script','dataLayer', GTMid);
				}
			});
		});
	}

	/******************************* 共用function *******************************/
	//取得頁面中全部有src的<script>元素
	function scriptList(){
		return Array.apply(null, document.querySelectorAll('script')).filter(v=> v.src !== '').map(j=> j.src.toUpperCase());
	}
	//取cookie的值
	function getCookie(cookie_name) {
		var name = cookie_name + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for(var i = 0; i <ca.length; i++) {
			var c = ca[i];
				while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
				if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}
	//插入<script>
	function appendScript(src, loadedFn, errorFn, id, async = false){
		let script = document.createElement('script');
		script.type = 'text/javascript';
		if(id) script.id = id;
		if(async) script.async = true;
		script.src = src;
		document.getElementsByTagName('head')[0].appendChild(script);
		script.onload = loadedFn;
		script.onerror = errorFn;
	};
})();






/******************************* 舊的GA程式，等到Google完全不支援GA後再刪掉 *******************************/

var DN = location.hostname.toLowerCase();
var CSO_Str = '/cso/';
var KR_Str = '/kartrider/';
var MS_Str = '/maplestory/';
var MS2_Str = '/pubad/maplestory/';
var BB_Str = '/bubblefighter/';
var BB2_Str = '/pubad/tbf/';
var ELS = '/elsword/';

(function (i, s, o, g, r, a, m) {
	i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
		(i[r].q = i[r].q || []).push(arguments)
	}, i[r].l = 1 * new Date(); a = s.createElement(o),
		m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
//ga('create', 'UA-32473452-1', 'auto', { 'name': 'Moon' });
ga('create', 'UA-72604446-1', 'auto', { 'name': 'GungHo' });
ga('create', 'UA-69989076-3', 'auto', { 'name': 'Gamania' });   //建立第二組 cookie
ga('create', 'UA-59442535-1', 'auto', { 'name': 'CSO' });       //建立第三組 cookie
ga('create', 'UA-72765934-1', 'auto', { 'name': 'KR' });        //建立第四組 cookie 跑跑卡丁車
ga('create', 'UA-59441236-1', 'auto', { 'name': 'MS' });        //建立第五組 cookie 新楓之谷
ga('create', 'UA-92433114-1', 'auto', { 'name': 'BB' });        //建立第六組 cookie 泡泡大亂鬥
ga('create', 'UA-108604813-1', 'auto', { 'name': 'ELS' });      //建立第七組 cookie 艾爾之光
ga('create', 'UA-110926082-1', 'auto', { 'name': 'beanM' });    //建立第八組 cookie beanfun M版

if (DN == 'tw.event.gungho-gamania.com') {

	ga('require', 'linker');
	ga('linker:autoLink', ['www.gungho-gamania.com']);
	ga('GungHo.send', 'pageview');

}

else if (DN == 'www.gungho-gamania.com') {

	ga('require', 'linker');
	ga('linker:autoLink', ['tw.event.gungho-gamania.com']);
	ga('GungHo.send', 'pageview');

}

else if (DN == 'tw.event.beanfun.com' || DN == 'event.beanfun.com') {

	ga('require', 'linker');
	ga('linker:autoLink', ['tw.beanfun.com', 'tw.newlogin.beanfun.com', 'tw.keypasco.beanfun.com', 'tw.playsafecard.beanfun.com',
		'tw.token.beanfun.com', 'tw.gamaotp.beanfun.com', 'tw.gamaotp.beanfun.com',
		'tw.fsecure.beanfun.com', 'tw.patch.beanfun.com']);
	ga('Gamania.send', 'pageview');
	//ga('Moon.send', 'pageview');

	//if (location.pathname.substring(1, 4) == 'cso')
	if (location.pathname.substring(0, CSO_Str.length).toLowerCase() == CSO_Str) {
		ga('require', 'linker');
		ga('linker:autoLink', ['tw.beanfun.com']);
		ga('CSO.send', 'pageview');
	}
	else if (location.pathname.substring(0, KR_Str.length).toLowerCase() == KR_Str) {
		ga('require', 'linker');
		ga('linker:autoLink', ['tw.beanfun.com']);
		ga('KR.send', 'pageview');
	}
	else if (location.pathname.substring(0, BB_Str.length).toLowerCase() == BB_Str) {
		ga('require', 'linker');
		ga('linker:autoLink', ['tw.beanfun.com']);
		ga('BB.send', 'pageview');
	}
	else if (location.pathname.substring(0, MS_Str.length).toLowerCase() == MS_Str) {
		ga('require', 'linker');
		ga('linker:autoLink', ['tw.beanfun.com']);
		ga('MS.send', 'pageview');
	}
	else if (location.pathname.substring(0, ELS.length).toLowerCase() == ELS) {
		ga('require', 'linker');
		ga('linker:autoLink', ['tw.beanfun.com']);
		ga('ELS.send', 'pageview');
	}

}
else if (DN == 'tw.beanfun.com') {

	ga('require', 'linker');
	ga('linker:autoLink', ['tw.event.beanfun.com', 'event.beanfun.com', 'tw.newlogin.beanfun.com', 'tw.keypasco.beanfun.com', 'tw.playsafecard.beanfun.com',
		'tw.token.beanfun.com', 'tw.otpsafe.beanfun.com', 'tw.gamaotp.beanfun.com', 'tw.gamaotp.beanfun.com',
		'tw.fsecure.beanfun.com', 'tw.patch.beanfun.com']);
	ga('Gamania.send', 'pageview');
	//ga('Moon.send', 'pageview');

	//if (location.pathname.substring(1, 4) == 'cso')
	if (location.pathname.substring(0, CSO_Str.length).toLowerCase() == CSO_Str) {
		ga('require', 'linker');
		ga('linker:autoLink', ['tw.event.beanfun.com', 'event.beanfun.com']);
		ga('CSO.send', 'pageview');
	}
	else if (location.pathname.substring(0, KR_Str.length).toLowerCase() == KR_Str) {
		ga('require', 'linker');
		ga('linker:autoLink', ['tw.event.beanfun.com', 'event.beanfun.com']);
		ga('KR.send', 'pageview');
	}
	else if (location.pathname.substring(0, BB_Str.length).toLowerCase() == BB_Str) {
		ga('require', 'linker');
		ga('linker:autoLink', ['tw.event.beanfun.com', 'event.beanfun.com']);
		ga('BB.send', 'pageview');
	}
	else if (location.pathname.substring(0, MS_Str.length).toLowerCase() == MS_Str) {
		ga('require', 'linker');
		ga('linker:autoLink', ['tw.event.beanfun.com', 'event.beanfun.com']);
		ga('MS.send', 'pageview');
	}
	else if (location.pathname.substring(0, ELS.length).toLowerCase() == ELS) {
		ga('require', 'linker');
		ga('linker:autoLink', ['tw.event.beanfun.com', 'event.beanfun.com']);
		ga('ELS.send', 'pageview');
	}

}

else if (DN == 'tw.newlogin.beanfun.com') {

	ga('require', 'linker');
	ga('linker:autoLink', ['tw.event.beanfun.com', 'event.beanfun.com', 'tw.beanfun.com', 'tw.keypasco.beanfun.com', 'tw.playsafecard.beanfun.com',
		'tw.token.beanfun.com', 'tw.otpsafe.beanfun.com', 'tw.gamaotp.beanfun.com', 'tw.gamaotp.beanfun.com',
		'tw.fsecure.beanfun.com', 'tw.patch.beanfun.com']);
	ga('Gamania.send', 'pageview');
	//ga('Moon.send', 'pageview');

}

else if (DN == 'tw.keypasco.beanfun.com') {

	ga('require', 'linker');
	ga('linker:autoLink', ['tw.event.beanfun.com', 'event.beanfun.com', 'tw.beanfun.com', 'tw.newlogin.beanfun.com', 'tw.playsafecard.beanfun.com',
		'tw.token.beanfun.com', 'tw.otpsafe.beanfun.com', 'tw.gamaotp.beanfun.com', 'tw.gamaotp.beanfun.com',
		'tw.fsecure.beanfun.com', 'tw.patch.beanfun.com']);
	ga('Gamania.send', 'pageview');
	//ga('Moon.send', 'pageview');

}

else if (DN == 'tw.playsafecard.beanfun.com') {

	ga('require', 'linker');
	ga('linker:autoLink', ['tw.event.beanfun.com', 'event.beanfun.com', 'tw.beanfun.com', 'tw.keypasco.beanfun.com', 'tw.newlogin.beanfun.com',
		'tw.token.beanfun.com', 'tw.otpsafe.beanfun.com', 'tw.gamaotp.beanfun.com', 'tw.gamaotp.beanfun.com',
		'tw.fsecure.beanfun.com', 'tw.patch.beanfun.com']);
	ga('Gamania.send', 'pageview');
	//ga('Moon.send', 'pageview');

}

else if (DN == 'tw.gamaotp.beanfun.com') {

	ga('require', 'linker');
	ga('linker:autoLink', ['tw.event.beanfun.com', 'event.beanfun.com', 'tw.beanfun.com', 'tw.keypasco.beanfun.com', 'tw.newlogin.beanfun.com',
		'tw.token.beanfun.com', 'tw.otpsafe.beanfun.com', 'tw.gamaotp.beanfun.com',
		'tw.fsecure.beanfun.com', 'tw.patch.beanfun.com']);
	ga('Gamania.send', 'pageview');
	//ga('Moon.send', 'pageview');

}
else if (DN == 'tw.token.beanfun.com') {


	ga('require', 'linker');
	ga('linker:autoLink', ['tw.event.beanfun.com', 'event.beanfun.com', 'tw.beanfun.com', 'tw.newlogin.beanfun.com', 'tw.playsafecard.beanfun.com',
		'tw.keypasco.beanfun.com', 'tw.otpsafe.beanfun.com', 'tw.gamaotp.beanfun.com',
		'tw.fsecure.beanfun.com', 'tw.patch.beanfun.com']);
	ga('Gamania.send', 'pageview');
	//ga('Moon.send', 'pageview');

}

else if (DN == 'tw.otpsafe.beanfun.com') {

	ga('require', 'linker');
	ga('linker:autoLink', ['tw.event.beanfun.com', 'event.beanfun.com', 'tw.beanfun.com', 'tw.newlogin.beanfun.com', 'tw.playsafecard.beanfun.com',
		'tw.keypasco.beanfun.com', 'tw.token.beanfun.com', 'tw.gamaotp.beanfun.com',
		'tw.fsecure.beanfun.com', 'tw.patch.beanfun.com']);
	ga('Gamania.send', 'pageview');
	//ga('Moon.send', 'pageview');

}

else if (DN == 'tw.gamaotp.beanfun.com') {


	ga('require', 'linker');
	ga('linker:autoLink', ['tw.event.beanfun.com', 'event.beanfun.com', 'tw.beanfun.com', 'tw.newlogin.beanfun.com', 'tw.playsafecard.beanfun.com',
		'tw.keypasco.beanfun.com', 'tw.token.beanfun.com', 'tw.otpsafe.beanfun.com',
		'tw.fsecure.beanfun.com', 'tw.patch.beanfun.com']);
	ga('Gamania.send', 'pageview');
	//ga('Moon.send', 'pageview');

}

else if (DN == 'tw.fsecure.beanfun.com') {


	ga('require', 'linker');
	ga('linker:autoLink', ['tw.event.beanfun.com', 'event.beanfun.com', 'tw.beanfun.com', 'tw.newlogin.beanfun.com', 'tw.playsafecard.beanfun.com',
		'tw.keypasco.beanfun.com', 'tw.token.beanfun.com', 'tw.otpsafe.beanfun.com',
		'tw.gamaotp.beanfun.com', 'tw.patch.beanfun.com']);
	ga('Gamania.send', 'pageview');
	//ga('Moon.send', 'pageview');

}
else if (DN == 'tw.patch.beanfun.com') {


	ga('require', 'linker');
	ga('linker:autoLink', ['tw.event.beanfun.com', 'event.beanfun.com', 'tw.beanfun.com', 'tw.newlogin.beanfun.com', 'tw.playsafecard.beanfun.com',
		'tw.keypasco.beanfun.com', 'tw.token.beanfun.com', 'tw.otpsafe.beanfun.com',
		'tw.gamaotp.beanfun.com', 'tw.fsecure.beanfun.com']);
	ga('Gamania.send', 'pageview');
	//ga('Moon.send', 'pageview');

	if (location.pathname.substring(0, BB2_Str.length).toLowerCase() == BB2_Str) {
		ga('require', 'linker');
		ga('linker:autoLink', ['tw.beanfun.com']);
		ga('BB.send', 'pageview');
	}
	else if (location.pathname.substring(0, MS2_Str.length).toLowerCase() == MS2_Str) {
		ga('require', 'linker');
		ga('linker:autoLink', ['tw.beanfun.com']);
		ga('MS.send', 'pageview');
	}
	else if (location.pathname.substring(0, ELS.length).toLowerCase() == ELS) {
		ga('require', 'linker');
		ga('linker:autoLink', ['tw.beanfun.com']);
		ga('ELS.send', 'pageview');
	}

}
else if (DN == 'm.beanfun.com') {
	ga('require', 'linker');
	ga('linker:autoLink', ['tw.event.beanfun.com', 'event.beanfun.com', 'tw.newlogin.beanfun.com', 'tw.keypasco.beanfun.com', 'tw.playsafecard.beanfun.com',
		'tw.token.beanfun.com', 'tw.otpsafe.beanfun.com', 'tw.gamaotp.beanfun.com', 'tw.gamaotp.beanfun.com',
		'tw.fsecure.beanfun.com', 'tw.patch.beanfun.com', 'tw.beanfun.com', 'm.beanfun.com']);
	ga('beanM.send', 'pageview');
}

/******************************* [END] 舊的GA程式 *******************************/