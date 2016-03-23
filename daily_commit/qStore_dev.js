// qStore.js
// 3个基础功能[下载、去详情页、打开链接]

// 20141112 添加 qStore.util.ready函数

// 20150617 添加 needapkdata字段，游戏是否包含数据包

(function(){

var qStore = {};
var __gappDataHash = {};
var _data = {}; // 存储数据
// 工具函数
var util = qStore.util = {
    param : function(obj) {
        var buffer = [];

        for (var key in obj) {
            buffer.push(key + '=' + encodeURIComponent(obj[key]));
        }

        return buffer.join('&');
    },
    
    getQuery : function(key) {
        var query = window.location.search.substr(1);
        var parts = query.split('&');
    
        for (var i = 0, len = parts.length; i < len; i++) {
            var kv = parts[i].split('=');
        
            if (kv[0] == key) {
                try {
                    return decodeURIComponent(kv[1]);
                } catch(e){
                    return kv[1];
                }
            }
        }
        
        return undefined;
    },

    mix : function(target, source, overwrite) {
        for (var i in source) {
            if (target[i] && !overwrite) {
                continue;
            }
            
            target[i] = source[i];
        }

        return target;
    },

    toArray : function(list, start) {
        return [].slice.call(list, start || 0);
    },
    
    isApp : function(){
        return typeof window.AndroidWebview != 'undefined';
    },

    cmd : function(cmdName) {
        try {
            return AndroidWebview[cmdName].apply(AndroidWebview, this.toArray(arguments, 1));
        } catch(e) {
            window.console && console.log([].join.call(arguments, '|'));
            return undefined;
        }
    },

    //1120 添加 模拟用户信息
    getCurrentUserInfo : function(){
        var info = this.cmd('getCurrentUserInfo')

        return (typeof info == 'string') ? JSON.parse(info) : {
            "qid":"116382103",
            "avatar":"http://quc.qhimg.com/dm/48_48_100/t015b2e7c892bd43b7b.jpg",
            "isDefaltAvatar":false,
            "name":"大冒险家123"
        }
    },
    
    getClientInfo : function() {
        var info = this.cmd('getClientInfo');

        return (typeof info == 'string') ?  JSON.parse(info) : {
            'version' : '0',
            'imei' : '',
            'os' : '7'
        };
    },

    log : function(str){
        this.cmd('showMessage', ''+str);
    },

    cookie : function (key, value, options) {
        var days, time, result, decode;

        // A key and value were given. Set cookie.
        if (arguments.length > 1 && String(value) !== "[object Object]") {
            // Enforce object
            options = options || {};

            if (value === null || value === undefined) options.expires = -1;

            if (typeof options.expires === 'number') {
                days = (options.expires * 24 * 60 * 60 * 1000);
                time = options.expires = new Date();

                time.setTime(time.getTime() + days);
            }
            // 精确时间
            else if (typeof options.expiresExact) {
                options.expires = options.expiresExact;
            }

            value = String(value);
            options.path = options.path || '/';
            options.domain = options.domain || '.360.cn';
            
            return (document.cookie = [
                encodeURIComponent(key), '=',
                options.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toGMTString() : '',
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        }

        // Key and possibly options given, get cookie
        options = value || {};

        decode = options.raw ? function (s) { return s } : decodeURIComponent;

        return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
    },

    // 发送一个script请求
    scriptRequest : function(url) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        document.body.appendChild(script);
    },
    
    // 将App数据添加到全局对象
    // todo 做一个缓冲，防止页面初始化时数据量过大导致UI暂停过长
    addAppData : function(varName, data) {
        if (typeof varName != 'string') {
            data = varName;
            varName = '__gappDataHash';
        }
        
        if (!window[varName]) {
            window[varName] = {};
        }
        
        // data 为数组
        if (data.push) {
            for(var i = 0, len = data.length; i < len; i++) {
                window[varName][data[i]['soft_id']] = data[i];
            }
        } else {
            this.mix(window[varName], data, true);
        }
    },
    
    getAppData : function(sid){
        return window['__gappDataHash'][sid];
    },
    
    // 简单数据存取
    data : function(key, value) {
        var argc = arguments.length;
        return  argc == 2 ? (_data[key] = value) : argc == 1 ? _data[key] : _data;
    },
    
    /**
     *  AndroidWebview准备就绪并执行对应函数
     * 
     *  @param {function} readyFunc    AndroidWebview准备就绪
     *  @param {function} notReadyFunc 未检测到AndroidWebview
     * 
     */
    ready : function(readyFunc, notReadyFunc) {
        var checkTimes = 0;
        
        (function(){
            if (checkTimes++ >= 20) {
                notReadyFunc();
                return;
            }
            if (window.AndroidWebview) {
                readyFunc();
            } else {
                setTimeout(arguments.callee, 50);
            }
        })();   
    }
};


// 获取MID
// 禁止本地存储后，直接访问localStorage会报错
var localStorageEnable = (function(){try{ return !!window.localStorage; }catch(e){return false;}})();
    
var midKey = '____guid';
var MID = {
    get : function() {
        return window.gmid || this.guid || localStorageEnable && window.localStorage[midKey] || util.cookie(midKey) || this.getMobileMID();
    },
    
    _save : function(mid) {
        if (localStorageEnable) {
            window.localStorage[midKey] = mid;
        } else {
             util.cookie(midKey, mid, {expires : 777});
        }
        
        this.guid = mid;
    },

    getMobileMID : function () {
        // 先获取m2
        var m2 = util.getQuery('m2');
        if (m2 && m2.length == 32) {
            this._save(m2);
            return m2;
        }
        
        try {
            var e = JSON.parse(AndroidWebview.getClientInfo());
            return (this.guid = e.m2 || this.generateMID());
        } catch (t) {
            return  this.generateMID();
        }
    },

    generateMID : function() {
        var guidKey = midKey;
        var doc = document, 
            nav = navigator,
            screen = window.screen,
            domain = doc.domain.toLowerCase(),
            ua = nav.userAgent.toLowerCase();

        function hash(s) {
            var h = 0, 
                g = 0,
                i = s.length - 1;
            for(i; i>= 0; i--) {
                var code = parseInt(s.charCodeAt(i), 10);
                h = ((h << 6) & 0xfffffff) + code + (code << 14);
                if ((g = h & 0xfe00000) != 0) {
                    h = (h ^ (g >> 21));
                }
            }
            return h;
        }

        function guid() {
            var s = [nav.appName, nav.version, nav.language || nav.browserLanguage, nav.platform, nav.userAgent, screen.width, 'x', screen.height, screen.colorDepth, doc.referrer].join(""),
                sLen = s.length,
                hLen = window.history.length;

            while(hLen) {
                s += (hLen--) ^ (sLen++);
            }

            return (Math.round(Math.random() * 2147483647) ^ hash(s)) * 2147483647;
        }

        var id;
        id = [ hash(doc.domain), guid(), +new Date + Math.random() + Math.random() ].join('');
        id = id.replace(/\./ig, 'e');
        id = id.substr(0, 32);
        this._save(id);
        
        return id;
    }
};

util.getMID = function() {
    return MID.get();
};
    
util.getClientInfo = function(renew) {
    if (this._clientInfo && !renew) {
        return this._clientInfo;
    }
    
    var info = this.cmd('getClientInfo');

    return (this._clientInfo = (typeof info == 'string') ?  JSON.parse(info) : {
        'version' : 0,
        'imei' : this.getMID(),
        'os' : '7'
    });
};

util.localStorageEnable = localStorageEnable;


window.qStore = qStore;
window.__gappDataHash = __gappDataHash;

// IE下不处理
if (!window.addEventListener) return;


var callbackid = 1;
// 手机端基础功能
var SpecialUtil = {
    _getSID : function(el, prop) {
        if (typeof el == 'string') {
            return el;
        }
        
        var sid;
        while(el && el != document) {
            sid = el.getAttribute(prop || 'data-sid');
            if (sid) return sid;

            el = el.parentNode;
        }

        return null;
    },
    
    // 获取远程数据
    // todo 支持epub
    _getRemoteAppData : function(sid, callback) {
        var jsonpHandler = '__jsonp' + (++callbackid);
        var server = 'http://openbox.mobilem.360.cn/index/getSoftInfoByIdsAccordingToFields/callback/' + jsonpHandler + '/sids/' + sid +'/fields/';
        var fields = [
           'pname','soft_id','soft_name','logo_url','download_urls','version_code','apk_sizes','signature_md5s','type','baike_name','is_g','package_count'
        ];

        window[jsonpHandler] = callback;

        util.scriptRequest(server + fields.join('|'));
        // util.log('正在准备数据...');
    },

    _getAppData : function(sid, callback, action, btn) {
        if (!sid) {
            var caller = window.__showError__ ? window : util;
            var fn = (window.__showError__ || util.log);
            //fn.call(caller, 'ERROR: 未找到软件ID');
            return false;
        }
        
        var onGetData = function(app){
            // 数据修理
            if (typeof window.__filterAppData__ == 'function') {
                app = __filterAppData__(app, action, btn);
            }

            // 手游push用渠道包
            var from = qStore.util.getQuery('from');
            if (from && from.indexOf('mp_') == 0) {
           		app.down_url = 'http://api.np.mobilem.360.cn/redirect/down?from=' + from + '&sid=' + app.soft_id;
           	}
            
            return callback(app);
        };
        
        if (typeof window.getAppData == 'function' || typeof window.__getAppData__ == 'function') {
            var data = (window.getAppData || __getAppData__)(sid);
            if (data) {
                return onGetData(data);
            }
        }

        if (!window.__gappDataHash[sid]) {
            this._getRemoteAppData(sid, function(data){
                var appData = data[sid];
                //console.log(JSON.stringify(appData));
                var data = util.mix({},{
                    apkid : appData.pname,
                    soft_id : appData.soft_id,
                    name : appData.soft_name,
                    baike_name : appData.baike_name,
                    type : appData.type,
                    logo_url : appData.logo_url,
                    
                    version_code : appData.version_code,
                    down_url : appData.download_urls.split(',')[0],
                    signature_md5 : appData.signature_md5s.split(',')[0],
                    size : appData.apk_sizes.split(',')[0],
                    is_g: appData.is_g || 0,
                    needapkdata : appData.package_count > 0 ? "1" : "0"     // 20150617 游戏是否包含数据包
                });
                                
                onGetData(data);

                // 保存加载下来的数据
                __gappDataHash[sid] = data;
            });
        } else {
            onGetData(__gappDataHash[sid]);
        }
    },

    download : function(sid, el) {
        this._getAppData(sid, function(app) {
            if (!app) {
                return;
            }
            
            // todo 需要fix数据
            if(app.type == "ebook" && app.cpbook_id && app.cpbook_detailurl && window.AndroidWebview && typeof AndroidWebview.openCPBook == "function"){
                /*
                    对电子书CP，增加接口openCPBook，使下载同一CP的电子书时仅下载一个CP应用
                    孟超 陈涛 曹文彬
                    调用 openCPBook 接口必要条件：
                        1. 接口存在
                        2. type 为 ebook
                        3. app数据中包含 cpbook_id cpbook_detailurl
                */
                util.cmd('openCPBook', JSON.stringify(app));
            } else {
                util.cmd('downloadApp', JSON.stringify(app));
            }
        }, 'download', el);
    },

    gotoDetail : function(sid) {
        this._getAppData(sid, function(app) {
            var app = util.mix({'page' : 'detail'}, app);
            util.cmd('gotoPage', JSON.stringify(app));
        }, 'detail');
    },

    openPage : function(el) {
        var url = (typeof el == 'string') ? el : (el.getAttribute('href') || el.getAttribute('data-href'));
        util.cmd('openPage', url);
    },
    
    openApp : function(sid){
        this._getAppData(sid, function(app) {
            var openResourceSuccess = false; // 非APK资源
            
            if (window.__openNewResource__) {
                openResourceSuccess = window.__openNewResource__(sid, app);
            }

            if(!openResourceSuccess){
                if(app.type == "ebook" && app.cpbook_id && app.cpbook_detailurl && window.AndroidWebview && typeof AndroidWebview.openCPBook == "function"){
                    /*
                        参见downloadApp
                    */
                    util.cmd('openCPBook', JSON.stringify(app));
                } else {
                    util.cmd('launchApp', JSON.stringify({
                        apkid : app.apkid
                    }));
                }
            }
       });
    },

    pause : function(sid) {
        this._getAppData(sid, function(app){
            util.cmd('pauseDownloadApp', app.apkid);
        });
    }
};


function getClasses(el) {
    var classes = (el.className || '').split(/\s+/i);
    var obj = {};

    for (var i = 0, len = classes.length; i < len; i++) {
        obj[classes[i]] = '1';
    }

    return obj;
}

function prenventDefault(evt){
    // 助手攻略具备AndroidWebview对象
    if ((typeof window.__isFakeZhushou__ == 'function') && __isFakeZhushou__()) {
        return;
    }
    
    (window.AndroidWebview || window.__isClient__ ) && evt.preventDefault();    
}

/**
 * 处理特殊事件
 * 主要处理常用的下载，跳转详情页，打开链接等功能 
 * todo 需要加各种条件挂载机制
 *
 * @return {boolean} true-停止冒泡， false-继续冒泡
 */
function handleSpecialEvent(el, evt) {

    /* classObj: Object {app-dbtn: "1", js-app-btn: "1", btn_resume: "1"} */
    var classObj = getClasses(el); 
    
    var sid = SpecialUtil._getSID(el);
        
    // 下载
    if (classObj['js-download'] || classObj['btn_download'] || classObj['btn_resume'] || classObj['btn_update']) {
        // 做一定延迟，因为点击下载按钮时，可能会设定一些全局状态，而__continueDownload__可能需要读取这些状态
        setTimeout(function(){
            var continueDownload = true;
            if (typeof window.__continueDownload__ == 'function') {
                continueDownload = __continueDownload__(sid, el, evt);
            }
            continueDownload && SpecialUtil.download(sid,el);
        }, 50);
        
        return true;
    }
    // 下载中状态
    // 不做任何事情
    else if (classObj['btn_downloading']) {
        return true;
    }
    // 去详情页
    else if (classObj['js-detail'] || classObj['app-item']) {
        // 判断是否能跳转
        var stopped = false;
        if (window.__stopGotoDetail__) {
            stopped = __stopGotoDetail__(sid, el, evt);
        }
        
        if (!stopped) {
            // 延迟跳转
            var delay = window.__gotoDetailDelay__ || (window.__getGotoDetailDelay__ || function(){return 0;})(el);
            if (delay) {
                setTimeout(function(){
                    SpecialUtil.gotoDetail(sid);
                }, delay);
            } else {
                SpecialUtil.gotoDetail(sid);
            }
            
            return true;
        }
        
        return false;
    }
    // 打开应用
    else if (classObj['js-open-app'] || classObj['btn_open']) {
        // 取消打开     
        var cancelOpen = false;     
        if (window.__stopOpenApp__) {       
            cancelOpen = window.__stopOpenApp__(sid);       
        }       
        
        if (cancelOpen) {       
            return true;        
        }
        
        // 延迟打开
        var delay = window.__openAppDelay__ || (window.__getOpenAppDelay__ || function(){return 0;})(el);
        if (delay) {
            setTimeout(function(){
                SpecialUtil.openApp(sid);
            }, delay);
        } else {
            SpecialUtil.openApp(sid);
        }

        return true;
    }
    // 打开链接
    else if (classObj['js-link']) {
        SpecialUtil.openPage(el);
       
        return true;
    } 
    // 安装本地包, AppStatusMgr 处理
    else if (classObj['btn_install']) {
        return true;
    }

    // 暂停
    else if (classObj['btn_pause']) {
        SpecialUtil.pause(sid);

        return true;
    }

    return false;
}

// 添加body点击事件
// todo 改成fastClick
(function () {
    if (!document.body) {
        setTimeout(arguments.callee, 100);
        return;
    }

    document.body.addEventListener('click', function(evt) {
        var el = evt.target;
        
        // todo 检测el是否是下载按钮
        // if (isDownloadBtn(el)) {
        //  handleDownloadBtn();
        //  return;
        // }

        while(el) {
            var stopBubble = handleSpecialEvent(el, evt);
            if (stopBubble) {
                prenventDefault(evt);
                break;
            }

            el = el.parentNode;
        }

    }, false);
})();

// 下载相关     
qStore.fn = SpecialUtil;    
qStore.fn.handleSpecialEvent = handleSpecialEvent;
    
})();

// LOG
/*
var html = 'http://s.360.cn/zhushou/soft.html?u=http://openbox.mobilem.360.cn/html/events/guanggunjie.html&ver=&mid=&cid=1&from=1&act=start&sid=795797&marke
t_id=&pos=mobile&tj=&refer=&14400583924725652';
*/
//http://data.zhushou.add.corp.qihoo.net/
(function(){

var util = qStore.util;
var queue = []; // 请求队列
var isLoading = false;
var Logger = {

    /**
     * 获取当前页面URL
     * @return {string}
     */
    getPageHref : function() {
        return location.protocol + '//' + location.host + location.pathname;
    },
    
    getRefer : function() {
        return util.getQuery('refer');
    },
    
    /**
     * 获取统计URL
     *
     * @param {string} sid, 软件ID
     * @param {string} act, start=下载，show=pv打点  browse=点击打点
     */
    getLogUrl : function(sid, act, pos, data) {
        var defaultParam = {
            u : this.getPageHref(),
            ver : '',
            mid : util.getQuery('m') || util.getMID(),
            cid : '',
            from : '',
            market_id : '360market',
            tj : '',
            refer : ''
        };

        var mainParam = {
            sid : sid || '',
            act : act || '',
            pos : pos || '',
            _ : (new Date).getTime()
        };

        var paramObj = {};
        paramObj = util.mix(paramObj, defaultParam);
        paramObj = util.mix(paramObj, data || {});
        paramObj = util.mix(paramObj, mainParam);

        var server = 'http://s.360.cn/zhushou/soft.html';

        return server + '?' + util.param(paramObj);
    },

    request : function(url) {
        if (!this.hamal) {           
            var hamal = this.hamal = new Image();
            
            hamal.onload = hamal.onerror = function() {
                isLoading = false;
                if (queue.length > 0) {
                    Logger.request(queue.shift());
                }
            };
        }
        
        if (isLoading) {
            queue.push(url);
            return;
        }
        isLoading = true;
        this.hamal.src = url;
    },

    //PV
        //qStore.logger.record('','show',a_id) ;
    //DownLoad
        //qStore.logger.record(sid,'start',a_id) ;
    record : function() {
        var logUrl = this.getLogUrl.apply(this, arguments);

        this.request(logUrl);
    }
};

qStore.logger = Logger;

})();

// support.js
(function(){
    var support = {};
    var clientInfo = qStore.util.getClientInfo();
    
    // 支持暂停下载功能
    support.pause = function() {
        return this._sp_pause || (this._sp_pause = clientInfo.version >= 111000102);
    };
    
    qStore.support = support;
})();
