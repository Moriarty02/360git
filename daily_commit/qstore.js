(function() {
    function f(e) {
        var t = (e.className || "").split(/\s+/i),
            n = {};
        for (var r = 0, i = t.length; r < i; r++) n[t[r]] = "1";
        return n
    }

    function l(e) {
        if (typeof window.__isFakeZhushou__ == "function" && __isFakeZhushou__()) return;
        (window.AndroidWebview || window.__isClient__) && e.preventDefault()
    }

    function c(e, t) {
        var n = f(e),
            r = a._getSID(e);
        if (n["js-download"] || n.btn_download || n.btn_resume || n.btn_update) return setTimeout(function() {
            var n = !0;
            typeof window.__continueDownload__ == "function" && (n = __continueDownload__(r, e, t)), n && a.download(r, e)
        }, 50), !0;
        if (n.btn_downloading) return !0;
        if (n["js-detail"] || n["app-item"]) {
            var i = !1;
            window.__stopGotoDetail__ && (i = __stopGotoDetail__(r, e, t));
            if (!i) {
                var s = window.__gotoDetailDelay__ || (window.__getGotoDetailDelay__ || function() {
                    return 0
                })(e);
                return s ? setTimeout(function() {
                    a.gotoDetail(r)
                }, s) : a.gotoDetail(r), !0
            }
            return !1
        }
        if (n["js-open-app"] || n.btn_open) {
            var o = !1;
            window.__stopOpenApp__ && (o = window.__stopOpenApp__(r));
            if (o) return !0;
            var s = window.__openAppDelay__ || (window.__getOpenAppDelay__ || function() {
                return 0
            })(e);
            return s ? setTimeout(function() {
                a.openApp(r)
            }, s) : a.openApp(r), !0
        }
        return n["js-link"] ? (a.openPage(e), !0) : n.btn_install ? !0 : n.btn_pause ? (a.pause(r), !0) : !1
    }
    var e = {},
        t = {},
        n = {},
        r = e.util = {
            param: function(e) {
                var t = [];
                for (var n in e) t.push(n + "=" + encodeURIComponent(e[n]));
                return t.join("&")
            },
            getQuery: function(e) {
                var t = window.location.search.substr(1),
                    n = t.split("&");
                for (var r = 0, i = n.length; r < i; r++) {
                    var s = n[r].split("=");
                    if (s[0] == e) try {
                        return decodeURIComponent(s[1])
                    } catch (o) {
                        return s[1]
                    }
                }
                return undefined
            },
            mix: function(e, t, n) {
                for (var r in t) {
                    if (e[r] && !n) continue;
                    e[r] = t[r]
                }
                return e
            },
            toArray: function(e, t) {
                return [].slice.call(e, t || 0)
            },
            isApp: function() {
                return typeof window.AndroidWebview != "undefined"
            },
            cmd: function(e) {
                try {
                    return AndroidWebview[e].apply(AndroidWebview, this.toArray(arguments, 1))
                } catch (t) {
                    return window.console && console.log([].join.call(arguments, "|")), undefined
                }
            },
            getCurrentUserInfo: function() {
                var e = this.cmd("getCurrentUserInfo");
                return typeof e == "string" ? JSON.parse(e) : {
                    qid: "116382103",
                    avatar: "http://quc.qhimg.com/dm/48_48_100/t015b2e7c892bd43b7b.jpg",
                    isDefaltAvatar: !1,
                    name: "\u5927\u5192\u9669\u5bb6123"
                }
            },
            getClientInfo: function() {
                var e = this.cmd("getClientInfo");
                return typeof e == "string" ? JSON.parse(e) : {
                    version: "0",
                    imei: "",
                    os: "7"
                }
            },
            log: function(e) {
                this.cmd("showMessage", "" + e)
            },
            cookie: function(e, t, n) {
                var r, i, s, o;
                if (arguments.length > 1 && String(t) !== "[object Object]") {
                    n = n || {};
                    if (t === null || t === undefined) n.expires = -1;
                    return typeof n.expires == "number" ? (r = n.expires * 24 * 60 * 60 * 1e3, i = n.expires = new Date, i.setTime(i.getTime() + r)) : typeof n.expiresExact && (n.expires = n.expiresExact), t = String(t), n.path = n.path || "/", n.domain = n.domain || ".360.cn", document.cookie = [encodeURIComponent(e), "=", n.raw ? t : encodeURIComponent(t), n.expires ? "; expires=" + n.expires.toGMTString() : "", n.path ? "; path=" + n.path : "", n.domain ? "; domain=" + n.domain : "", n.secure ? "; secure" : ""].join("")
                }
                return n = t || {}, o = n.raw ? function(e) {
                    return e
                } : decodeURIComponent, (s = (new RegExp("(?:^|; )" + encodeURIComponent(e) + "=([^;]*)")).exec(document.cookie)) ? o(s[1]) : null
            },
            scriptRequest: function(e) {
                var t = document.createElement("script");
                t.type = "text/javascript", t.src = e, document.body.appendChild(t)
            },
            addAppData: function(e, t) {
                typeof e != "string" && (t = e, e = "__gappDataHash"), window[e] || (window[e] = {});
                if (t.push)
                    for (var n = 0, r = t.length; n < r; n++) window[e][t[n].soft_id] = t[n];
                else this.mix(window[e], t, !0)
            },
            getAppData: function(e) {
                return window.__gappDataHash[e]
            },
            data: function(e, t) {
                var r = arguments.length;
                return r == 2 ? n[e] = t : r == 1 ? n[e] : n
            },
            ready: function(e, t) {
                var n = 0;
                (function() {
                    if (n++ >= 20) {
                        t();
                        return
                    }
                    window.AndroidWebview ? e() : setTimeout(arguments.callee, 50)
                })()
            }
        },
        i = function() {
            try {
                return !!window.localStorage
            } catch (e) {
                return !1
            }
        }(),
        s = "____guid",
        o = {
            get: function() {
                return window.gmid || this.guid || i && window.localStorage[s] || r.cookie(s) || this.getMobileMID()
            },
            _save: function(e) {
                i ? window.localStorage[s] = e : r.cookie(s, e, {
                    expires: 777
                }), this.guid = e
            },
            getMobileMID: function() {
                var e = r.getQuery("m2");
                if (e && e.length == 32) return this._save(e), e;
                try {
                    var t = JSON.parse(AndroidWebview.getClientInfo());
                    return this.guid = t.m2 || this.generateMID()
                } catch (n) {
                    return this.generateMID()
                }
            },
            generateMID: function() {
                function u(e) {
                    var t = 0,
                        n = 0,
                        r = e.length - 1;
                    for (r; r >= 0; r--) {
                        var i = parseInt(e.charCodeAt(r), 10);
                        t = (t << 6 & 268435455) + i + (i << 14), (n = t & 266338304) != 0 && (t ^= n >> 21)
                    }
                    return t
                }

                function a() {
                    var e = [n.appName, n.version, n.language || n.browserLanguage, n.platform, n.userAgent, r.width, "x", r.height, r.colorDepth, t.referrer].join(""),
                        i = e.length,
                        s = window.history.length;
                    while (s) e += s-- ^ i++;
                    return (Math.round(Math.random() * 2147483647) ^ u(e)) * 2147483647
                }
                var e = s,
                    t = document,
                    n = navigator,
                    r = window.screen,
                    i = t.domain.toLowerCase(),
                    o = n.userAgent.toLowerCase(),
                    f;
                return f = [u(t.domain), a(), +(new Date) + Math.random() + Math.random()].join(""), f = f.replace(/\./ig, "e"), f = f.substr(0, 32), this._save(f), f
            }
        };
    r.getMID = function() {
        return o.get()
    }, r.getClientInfo = function(e) {
        if (this._clientInfo && !e) return this._clientInfo;
        var t = this.cmd("getClientInfo");
        return this._clientInfo = typeof t == "string" ? JSON.parse(t) : {
            version: 0,
            imei: this.getMID(),
            os: "7"
        }
    }, r.localStorageEnable = i, window.qStore = e, window.__gappDataHash = t;
    if (!window.addEventListener) return;
    var u = 1,
        a = {
            _getSID: function(e, t) {
                if (typeof e == "string") return e;
                var n;
                while (e && e != document) {
                    n = e.getAttribute(t || "data-sid");
                    if (n) return n;
                    e = e.parentNode
                }
                return null
            },
            _getRemoteAppData: function(e, t) {
                var n = "__jsonp" + ++u,
                    i = "http://openbox.mobilem.360.cn/index/getSoftInfoByIdsAccordingToFields/callback/" + n + "/sids/" + e + "/fields/",
                    s = ["pname", "soft_id", "soft_name", "logo_url", "download_urls", "version_code", "apk_sizes", "signature_md5s", "type", "baike_name", "is_g", "package_count"];
                window[n] = t, r.scriptRequest(i + s.join("|"))
            },
            _getAppData: function(n, i, s, o) {
                if (!n) {
                    var u = window.__showError__ ? window : r,
                        a = window.__showError__ || r.log;
                    return !1
                }
                var f = function(t) {
                    typeof window.__filterAppData__ == "function" && (t = __filterAppData__(t, s, o));
                    var n = e.util.getQuery("from");
                    return n && n.indexOf("mp_") == 0 && (t.down_url = "http://api.np.mobilem.360.cn/redirect/down?from=" + n + "&sid=" + t.soft_id), i(t)
                };
                if (typeof window.getAppData == "function" || typeof window.__getAppData__ == "function") {
                    var l = (window.getAppData || __getAppData__)(n);
                    if (l) return f(l)
                }
                window.__gappDataHash[n] ? f(t[n]) : this._getRemoteAppData(n, function(e) {
                    var i = e[n],
                        e = r.mix({}, {
                            apkid: i.pname,
                            soft_id: i.soft_id,
                            name: i.soft_name,
                            baike_name: i.baike_name,
                            type: i.type,
                            logo_url: i.logo_url,
                            version_code: i.version_code,
                            down_url: i.download_urls.split(",")[0],
                            signature_md5: i.signature_md5s.split(",")[0],
                            size: i.apk_sizes.split(",")[0],
                            is_g: i.is_g || 0,
                            needapkdata: i.package_count > 0 ? "1" : "0"
                        });
                    f(e), t[n] = e
                })
            },
            download: function(e, t) {
                this._getAppData(e, function(e) {
                    if (!e) return;
                    e.type == "ebook" && e.cpbook_id && e.cpbook_detailurl && window.AndroidWebview && typeof AndroidWebview.openCPBook == "function" ? r.cmd("openCPBook", JSON.stringify(e)) : r.cmd("downloadApp", JSON.stringify(e))
                }, "download", t)
            },
            gotoDetail: function(e) {
                this._getAppData(e, function(e) {
                    var e = r.mix({
                        page: "detail"
                    }, e);
                    r.cmd("gotoPage", JSON.stringify(e))
                }, "detail")
            },
            openPage: function(e) {
                var t = typeof e == "string" ? e : e.getAttribute("href") || e.getAttribute("data-href");
                r.cmd("openPage", t)
            },
            openApp: function(e) {
                this._getAppData(e, function(t) {
                    var n = !1;
                    window.__openNewResource__ && (n = window.__openNewResource__(e, t)), n || (t.type == "ebook" && t.cpbook_id && t.cpbook_detailurl && window.AndroidWebview && typeof AndroidWebview.openCPBook == "function" ? r.cmd("openCPBook", JSON.stringify(t)) : r.cmd("launchApp", JSON.stringify({
                        apkid: t.apkid
                    })))
                })
            },
            pause: function(e) {
                this._getAppData(e, function(e) {
                    r.cmd("pauseDownloadApp", e.apkid)
                })
            }
        };
    (function() {
        if (!document.body) {
            setTimeout(arguments.callee, 100);
            return
        }
        document.body.addEventListener("click", function(e) {
            var t = e.target;
            while (t) {
                var n = c(t, e);
                if (n) {
                    l(e);
                    break
                }
                t = t.parentNode
            }
        }, !1)
    })(), e.fn = a, e.fn.handleSpecialEvent = c
})(),
function() {
    var e = qStore.util,
        t = [],
        n = !1,
        r = {
            getPageHref: function() {
                return location.protocol + "//" + location.host + location.pathname
            },
            getRefer: function() {
                return e.getQuery("refer")
            },
            getLogUrl: function(t, n, r, i) {
                var s = {
                        u: this.getPageHref(),
                        ver: "",
                        mid: e.getQuery("m") || e.getMID(),
                        cid: "",
                        from: "",
                        market_id: "360market",
                        tj: "",
                        refer: ""
                    },
                    o = {
                        sid: t || "",
                        act: n || "",
                        pos: r || "",
                        _: (new Date).getTime()
                    },
                    u = {};
                u = e.mix(u, s), u = e.mix(u, i || {}), u = e.mix(u, o);
                var a = "http://s.360.cn/zhushou/soft.html";
                return a + "?" + e.param(u)
            },
            request: function(e) {
                if (!this.hamal) {
                    var i = this.hamal = new Image;
                    i.onload = i.onerror = function() {
                        n = !1, t.length > 0 && r.request(t.shift())
                    }
                }
                if (n) {
                    t.push(e);
                    return
                }
                n = !0, this.hamal.src = e
            },
            record: function() {
                var e = this.getLogUrl.apply(this, arguments);
                this.request(e)
            }
        };
    qStore.logger = r
}(),
function() {
    var e = {},
        t = qStore.util.getClientInfo();
    e.pause = function() {
        return this._sp_pause || (this._sp_pause = t.version >= 111000102)
    }, qStore.support = e
}();
