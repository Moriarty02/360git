// 微信分享
        /**
         *  专题公用微信分享，样式请自行定义，配置参数如下，推荐默认参数
         *  @param {config}
         *      @c-param {string} 'btn' @default '#js-share';
         *      @c-param {string} 'wxPop' @defalt '#wxshare';
         *      @c-param {object} 'share' @deafult Config.share;
         *
         *  todo : 增加自定义分享地址/动态更新分享内容和地址
         *  
         *
         */ 
        var WxShare = (function(){

            // 微信内添加分享
            function initWXShare(share){
                var share = share || {};
                $.ajax({
                    url: 'http://huodong.mobilem.360.cn/weixin/getWeixinJsConfig',
                    data: {
                        url: location.href.split('#')[0],
                        _ : Math.random()
                    },
                    dataType: 'jsonp',
                    success: function(result) {
                        config = result.data;
                        wx.config({
                            debug: false,
                            appId: config.appId,
                            timestamp: config.timestamp,
                            nonceStr: config.nonceStr,
                            signature: config.signature,
                            jsApiList: [
                                'checkJsApi',
                                'onMenuShareTimeline',
                                'onMenuShareAppMessage',
                                'onMenuShareQQ',
                                'onMenuShareWeibo',
                            ]
                        });

                    }
                });
                wx.ready(function(){
                    var shareText = share.weixinText;
                    var shareUrl = share.weixinUrl || location.href.split('#')[0];
                    var shareImg = share.shareImg;
                    var shareTitle = share.weixinTitle;
                    var param = {
                        desc  : shareText,
                        link : shareUrl,
                        title : shareTitle,
                        imgUrl : shareImg
                    }
                    
                    wx.onMenuShareAppMessage(param);
                        
                    var _param = $.extend({}, param, {
                        title : shareText
                    });
                    wx.onMenuShareTimeline(_param);
                });
            }

            function init(config) {
                    
                var config = config || {},
                    btn = config.btn || '#js-share',
                    wxPop = config.wxPop || '#wxshare',
                    share = config.share || 
                            window.Config&&Config.share || 
                            {
                                // 新版接口
                                weiboText: '微博/短信分享文案+当前页面地址',
                                weixinText: '微信内文字',
                                weixinThumbnailUrl: 'http://p9.qhimg.com/t0157c42e3aec935835.jpg',
                                weixinTitle: '微信内标题',
                                // 旧版接口
                                shareText: '微博/微信分享文案',
                                shareImg: 'http://p9.qhimg.com/t0157c42e3aec935835.jpg'
                            },
                    $btn = $(btn),
                    $wxPop = $(wxPop);
                    try {
                        var clientInfo = AndroidWebview.getClientInfo();
                        clientInfo = JSON.parse(clientInfo);
                        if (clientInfo['oem'] == 'qiku') { 
                            $btn.hide();
                            $wxPop.hide();
                            return;
                        }
                    } catch(e) {
                    }
                // 如果是微信 => 加载微信内接口
                if( navigator.userAgent.indexOf("MicroMessenger") > -1 ) {
                    var head = document.getElementsByTagName('head')[0],
                        script = document.createElement('script');
                    script.async = "async";
                    script.src = "http://res.wx.qq.com/open/js/jweixin-1.0.0.js";
                    script.onload = function() {
                        initWXShare(share);
                    } 
                    head.appendChild( script );
                }
                $btn.on('click', function(e){
                    e.preventDefault();
                    if(window.AndroidWebview){
                        if(AndroidWebview.simpleShareToSNS){
                            qStore.util.cmd('simpleShareToSNS', JSON.stringify({
                                "default" : share.weiboText,
                                "weixin" : share.weixinText,
                                "weixinUrl" : share.weixinUrl || location.href.split('#')[0],
                                "weixinThumbnailUrl":share.weixinThumbnailUrl,
                                //你那个活动页的地址  
                                "weixinTitle" : share.weixinTitle, 
                                "needMonitor": false
                            }))
                        } else {
                            qStore.util.cmd('shareToSNS',JSON.stringify({
                                content : share.shareText,
                                imgUrl : share.shareImg
                            }));
                        }
                    } else if( navigator.userAgent.indexOf("MicroMessenger")>-1 ){
                        $wxPop.show();
                    } else {
                        var text = share.shareText;
                        var img = share.shareImg;
                        var url = location.href.split('?')[0];
                        var shareHref = "http://service.weibo.com/share/share.php?title=" + encodeURIComponent(text) + "&url=" + encodeURIComponent(url) + "&pic=" + encodeURIComponent(img);
                        location.href = shareHref;
                    }
                })
                $wxPop.on('click', function(e){
                    e.preventDefault();
                    $wxPop.hide();
                })
            }
            
            return {
                init : init,
                version : '1.0'
            };
        })();