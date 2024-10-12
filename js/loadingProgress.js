// 執行loadingProgress()這個方法會在頁面載入時在網頁上疊一個半透明的loading畫面（append一個div）
// 它會偵測網頁裡所有使用的圖檔及影片，在圖檔完全載入及影片載入目前的影格後那個半透明的loading畫面消失
// 如果你的網頁有用到大量圖檔就很適合使用
// 預設影片是不做偵測，可以在參數中做改變！

// 使用方法：
// 載入jQuery及loadingProgress.js
// 在網頁結尾（或是jQuery dom ready的function內）執行loadingProgress()就會自動運作
// 它有兩個function參數，一個是圖片/影片載入進度的function，另一個是結束時執行的function
// detectVideo參數（預設為false），改成true的話就會偵測影片
// autoHide參數（預設為true），改成false的話就不會關閉loading畫面，要自已下$('.loadingProgress').fadeOut();
// 其中載入進度的function可以pass一個參數，該參數會傳回目前載入的圖片/影片張數
// 使用上述兩個function就可以自己做一個自訂的載入畫面，例如有進度條的載入畫面

// DEMO（直接使用，什麼都不用做）
// loadingProgress();

// DEMO（頁面載入時console圖片/影片載入進度，全部載入後console 100）
// loadingProgress({
// 	countFN: function(count, length){
// 		console.log(Math.round(count / length * 100));
// 	},
// 	loadedFN: function(){
// 		console.log(100);
// 	},
// 	detectVideo: true,
//	autoHide: false
// });

// 註：
// 為避免未知錯誤，這個半透明的loading畫面預設在15秒後會自動消失，如果你有設置loadedFN也會在這時候執行

$(function(){
	$('body').append('<style>.loadingProgress{width:100%;height:100%;background:url(https://tw.hicdn.beanfun.com/beanfun/beanfun/common_assets/images/loading/type1.gif) 50% 50% rgba(0,0,0,.75) no-repeat;position:fixed;left:0;top:0;z-index:2147483648;}</style>');
	$('body').append('<div id="loadingProgress" class="loadingProgress" style="display:none;"></div>');
});

loadingProgress = function(arg){
	$(function(){
		if($('#loadingProgress').css('display') == 'none'){
			$('#loadingProgress').css({display:'block'});
		}

		var urlList = [];
		var assetList = [];
		var count = 0;
		var flag = true;
		var autoHide = true;
		try{
			arg.autoHide
			if(arg.autoHide !== undefined) autoHide = arg.autoHide;
			if(Object.keys(arg).length === 0){
				autoHide = true;
			}
		}catch(e){
			autoHide = true;
		}
		try{
			arg.detectVideo;
			var detectVideo = arg.detectVideo;
		}catch(e){
			var detectVideo = false;
		}
		$('*').each(function(){
			if($(this).css('background-image') != 'none' && $(this).css('background-image').indexOf(',') == -1){
				var bgUrl = $(this).css('background-image').replace(/"/g,'').replace(/url\(|\)$/ig,'');
				if(urlList.indexOf(bgUrl) == -1){
					urlList.push(bgUrl);
				}
			}
		});
		$('img').each(function(){
			var imgUrl = $(this)[0].src;
			if(urlList.indexOf(imgUrl) == -1){
				urlList.push(imgUrl);
			}
		});
		if(detectVideo){
			$('video').each(function(){
				if($('source', this).length){
					var vdoUrl = $('source', this)[0].src;
				}else{
					var vdoUrl = $(this)[0].src;
				}
				if(urlList.indexOf(vdoUrl) == -1){
					urlList.push(vdoUrl);
				}
			});
		}
		$.each(urlList, function(i, v){
			if(v.indexOf('mp4') != -1 || v.indexOf('mpg') != -1 || v.indexOf('mpeg') != -1 || v.indexOf('ogg') != -1 || v.indexOf('avi') != -1 && detectVideo){
				assetList[i] = document.createElement('video');
				assetList[i].setAttribute('src', v);
			}else{
				assetList[i] = new Image();
				assetList[i].src = v;
			}
		});
		for(var i = 0; i < assetList.length; i++){
			$(assetList[i]).on('load loadeddata error', function(){
				try{
					arg.countFN(count, assetList.length);
				}catch(e){};
				count++;
				if(count == i){
					//all assets loaded
					if(flag){
						if(autoHide) $('.loadingProgress').fadeOut();
						try{
							arg.loadedFN();
						}catch(e){};
					}
					flag = false;
				}
			});
		}
		//in case something goes wrong
		setTimeout(function(){
			if(flag){
				if(autoHide) $('.loadingProgress').fadeOut();
				try{
					arg.loadedFN();
				}catch(e){};
			}
			flag = false;
		}, 15000);
	});
}