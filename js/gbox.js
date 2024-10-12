(function ($) {
    /*
     * 動態引入CSS
     */
    var stylePath = "https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/style/gbox/";
    var newCssObj = document.createElement('link');
    newCssObj.type = 'text/css';
    newCssObj.rel = "stylesheet";
    newCssObj.href = stylePath + 'gbox.css';
    // newCssObj.href = './gbox.css';
    document.head.appendChild(newCssObj);

    var open = false;

    $pubBox = null;
    var PopupPlugin = function (content, options) {
        open = true;
        /*
         * 預設參數
         */
        var defaults = {
            titleBar: null,
            addClass: null,
            fixedPos: true,
            hasCloseBtn: false,
            closeBtn: '\u00D7', //可插入HTML
            clickBgClose: false,
            hasActionBtn: true,
            actionBtns: [{
                text: '確定',
                id: '',
                class:'',
                target: false,
                targetClose: true,
                click: function () {
                    $.gbox.close(settings.afterClose); //網址 or Function
                }
            }],
            afterClose: null, //網址 or Function
            afterOpen: null //function
        };
        //合併 defaults 和 options，修改並返回 defaults
        var settings = $.extend(defaults, options);

        /*
         * 建立popupBox
         */


        /*外容器*/
        $pubBox = $('<div class="gbox" id="gbox"></div>').appendTo('body');
        $pubModule = $('<div class="gbox-module"></div>').appendTo($pubBox);
        $pubWrap = $('<div class="gbox-wrap"></div>').appendTo($pubBox);
        /*內容區塊*/
        $pubContent = $('<div class="gbox-content"></div>').appendTo($pubWrap);
        //帶入內容
        $pubContent.html(content);

        /*新增外層Class */
        if (settings.addClass) {
            $pubBox.addClass(settings.addClass);
        }
        /*標題列*/
        if (settings.titleBar) {
            $pubTitleBar = $('<div class="gbox-title"></div>').prependTo($pubWrap);
            $pubTitleBar.html(settings.titleBar);
        }
        /*右上關閉按鈕 */
        if (settings.hasCloseBtn) {
            $pubCloseBtn = $('<button class="gbox-close"></button>').appendTo($pubWrap);
            $pubCloseBtn.html(settings.closeBtn);
            $pubCloseBtn.on('click', function () {
                //close popup
                $.gbox.close(settings.afterClose);
            });
        }
        /*鎖定畫面*/
        if (settings.fixedPos) {
            $('body').addClass('ov-hidden');
        }

        /*點擊背景關閉*/
        if (settings.clickBgClose) {
            $(document).on('mouseup', function (e) {
                var container = $('.gbox-wrap');
                if (!container.is(e.target) && container.has(e.target).length === 0) {
                    //close popup
                    $.gbox.close(settings.afterClose);
                }
            });
        }
        /*按鈕區塊*/
        if (settings.hasActionBtn) {
            $pubAction = $('<div class="gbox-action"></div>').appendTo($pubWrap);
            if (settings.actionBtns.length > 1) {
                settings.actionBtns.forEach(function (actionBtn, index) {
                    $pubActionBtn = $('<a class="gbox-btn"></a>').appendTo($pubAction);
                    $pubActionBtn.html(actionBtn.text);
                    if (actionBtn.id) {
                        $pubActionBtn.prop('id', actionBtn.id);
                    }
                    if (actionBtn.class) {
                        $pubActionBtn.addClass( actionBtn.class);
                    }
                    if (actionBtn.target && typeof actionBtn.click == 'string') {
                        $pubActionBtn.prop('target', '_blank');
                        if (actionBtn.targetClose){
                            $pubActionBtn.on('click', function(){$.gbox.close()});
                        }
                    }
                    if (typeof actionBtn.click == 'function') {
                        $pubActionBtn.prop('href', 'javascript:;');
                        $pubActionBtn.on('click', actionBtn.click);
                    } else if (typeof actionBtn.click == 'string') {
                        $pubActionBtn.prop('href', actionBtn.click);
                    }
                });
            } else {
                $pubActionBtn = $('<a class="gbox-btn"></a>').appendTo($pubAction);
                $pubActionBtn.html(settings.actionBtns[0].text);
                if (settings.actionBtns[0].id) {
                    $pubActionBtn.prop('id', settings.actionBtns[0].id);
                }
                if (settings.actionBtns[0].class) {
                    $pubActionBtn.addClass( settings.actionBtns[0].class);
                }
                if (settings.actionBtns[0].target && typeof settings.actionBtns[0].click == 'string') {
                    $pubActionBtn.prop('target', '_blank');
                    $pubActionBtn.on('click', function () { $.gbox.close() });
                }
                if (typeof settings.actionBtns[0].click == 'function') {
                    $pubActionBtn.prop('href', 'javascript:;');
                    $pubActionBtn.on('click', settings.actionBtns[0].click);
                } else if (typeof settings.actionBtns[0].click == 'string') {
                    $pubActionBtn.prop('href', settings.actionBtns[0].click);
                }
            }
        }
        /*一版到底*/
        var mates = document.getElementsByTagName('meta');
        for (var m = 0; m < mates.length; m++) {
            var mate = mates[m];
            if (mate.content.match(/750/)) {
                $pubWrap[0].className += ' vp750';
            }
        }

        /*開啟後Callback*/
        if (typeof settings.afterOpen == 'function') {
            settings.afterOpen();
        }
    };

    $.fn.gbox = function (content, options) {
        $(this).on('click', function (e) {
            e.preventDefault();
            if (open == false) {
                new PopupPlugin(content, options);
            }
        });
    };

    $.gbox = {
        close: function (callback) {
            open = false;
            if ($pubBox != null) {
                $pubBox.remove();
                $pubBox = null;

                $('body').removeClass('ov-hidden');
            }
            if ($.isFunction(callback)) {
                callback();
            } else if (typeof callback == 'string') {
                window.open(callback, '_self');
            }
        },
        open: function (content, options) {
            if (open == false) {
                new PopupPlugin(content, options);
            } else {
                $pubBox.remove();
                $pubBox = null;

                $('body').removeClass('ov-hidden');
                new PopupPlugin(content, options);
            }
        }
    };

})(jQuery);