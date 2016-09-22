(function() {
    function o(e) {
        return e >= 400 && e < 600 && e != 490 || e == 10495 || e > 10500 && e <= 11e3 || e < 0 && e != -2
    }

    function f(e, t) {
        var n = e / 1024;
        return n > 1024 || t ? (n / 1024).toFixed(2) + "M" : n.toFixed(2) + "K"
    }
    var e = qStore.util,
        t = {
            listener: {},
            fired: {},
            addGlobalEvent: function(t, n) {
                var r = this;
                !window[t] && (window[t] = function() {
                    r.fire.apply(r, [t].concat(e.toArray(arguments)))
                }), this.addEvent(t, n)
            },
            addEvent: function(e, t) {
                this.listener[e] ? this.listener[e].push(t) : this.listener[e] = [t]
            },
            fire: function(t) {
                this.fired[t] = e.toArray(arguments, 1);
                if (this.listener[t])
                    for (var n = 0, r = this.listener[t].length; n < r; n++) try {
                        this.listener[t][n].apply(window, e.toArray(arguments, 1))
                    } catch (i) {}
            },
            ready: function(e, t) {
                this.fired[e] ? t.apply(window, this.fired[e]) : this.addEvent(e, t)
            }
        },
        n = {
            getInstalledAppDone: !1,
            getDownloadPackageDone: !1,
            installedPackage: {},
            downloadPackage: {},
            getInstalledApp: function() {
                var n = this;
                t.addGlobalEvent("setAppStatus", function(e) {
                    n.installedPackage = e, n.getInstalledAppDone = !0
                }), e.cmd("getInstatllApp", "setAppStatus")
            },
            addDownloadEpub: function(e, t) {
                this.installedPackage[e] = t
            },
            getDownloadPackage: function() {
                this.getDownloadPackageDone = !0;
                var t = e.cmd("getDownloadApp");
                if (t) {
                    var n = JSON.parse(t),
                        r = {};
                    for (var i = n.length - 1; i >= 0; i--) r[n[i].pkgName] = n[i];
                    this.downloadPackage = r
                }
                this.getDownloadPackageDone = !0
            },
            initInstallApp: function() {
                e.cmd("addDownloadListenner"), e.cmd("setInstallReceiver", 1), t.addGlobalEvent("updateAppDownloadProgress", function(e) {
                    t.fire("installing", e)
                }), t.addGlobalEvent("AppInstallAction", function(e) {
                    t.fire("newpackage", e)
                })
            },
            init: function() {
                this.initInstallApp(), this.getInstalledApp(), this.getDownloadPackage();
                var e = 0,
                    n = this;
                (function() {
                    if (n.getInstalledAppDone && n.getDownloadPackageDone || e >= 20) {
                        t.fire("client_ready");
                        return
                    }
                    e += 1, setTimeout(arguments.callee, 50)
                })()
            }
        };
    n.init();
    var r = {},
        i = {
            label: {
                download: "\u4e0b\u8f7d",
                downloading: "\u4e0b\u8f7d\u4e2d",
                pause: "\u6682\u505c",
                resume: "\u7ee7\u7eed",
                update: "\u66f4\u65b0",
                open: "\u6253\u5f00",
                install: "\u5b89\u88c5",
                waiting: "\u7b49\u5f85\u4e2d",
                retry: "\u91cd\u8bd5"
            },
            getLabel: function(e, t, n) {
                var r;
                return typeof window.__getButtonLabel__ == "function" && (r = __getButtonLabel__(e, t, n)), r || this.label[e]
            },
            downloading: function(e, t) {
                var n = "downloading",
                    r = this._findBtn(e);
                this._update(r, n, this.getLabel(n, e, r), t)
            },
            retry: function(e) {
                var t = "retry",
                    n = this._findBtn(e);
                this._update(n, t, this.getLabel(t, e, n))
            },
            updateBtn: function(e, t, n) {
                var r = this._findBtn(t),
                    i = this.getLabel(e, t, r);
                i && this._update(r, e, i, n)
            },
            _update: function(e, t, n, r) {
                r = r || 0, e.html('<em class="app-dbtn-icon"></em><b class="app-dbtn-pw"><i class="app-dbtn-process" style="width:' + r + '%;"></i></b><span class="app-dbtn-label">' + n + "</span>");
                var i = e.attr("class");
                i = i.replace(/\s?btn_[^\s]+/g, ""), t == "retry" && (t = "download btn_retry"), i = i + " btn_" + t, e.attr("class", i)
            },
            _findBtn: function(e) {
                if (typeof e == "string") {
                    var t = r[e];
                    return t && t.width() ? t : (r[e] = this.container.find('[data-pname="' + e + '"]').find(".js-app-btn"), r[e])
                }
                return e
            },
            _init: function() {
                for (var e in this.label) {
                    var t = function() {
                        this.updateBtn(arguments.callee.status, arguments[0], arguments[1])
                    };
                    t.status = e, !this[e] && (this[e] = t)
                }
            },
            create: function(t, n) {
                var r = function() {
                    this.container = t, e.mix(this.label, n, !0), this._init()
                };
                return r.prototype = this, new r
            }
        },
        s = qStore.support,
        u = {
            getStatus: function(e) {
                if (n.installedPackage[e]) return "open";
                if (n.downloadPackage[e]) {
                    var t = n.downloadPackage[e].status;
                    return t == 200 || typeof t == "undefined" ? "install" : t == 193 || t == 196 ? "resume" : t >= 190 && t < 200 ? "downloading" : t == 1 ? "open" : "download"
                }
                return "download"
            },
            getLocalAppMgr: function() {
                return n
            },
            getButtonStatus: function(e) {
                var t = this.getStatus(e),
                    n = i.getLabel(t);
                return {
                    status: t,
                    label: n
                }
            },
            addDownloadEpub: function(e) {
                n.addDownloadEpub(e)
            },
            checkInstalling: function(e) {
                var t = this,
                    r = this.btnStatusMgr;
                for (var i in e)
                    if (e.hasOwnProperty(i)) {
                        var o = e[i],
                            u = o.status,
                            a = o.progress;
                        if (u == "200") r.install(i);
                        else if (u == "1") r.open(i), typeof window.__afterInstall__ == "function" && __afterInstall__(i);
                        else if (u == "490" || u == "193") {
                            var f = "download";
                            u == "193" && s && s.pause() && (f = "resume"), r[f](i)
                        } else u == "192" ? r[s && s.pause() ? "pause" : "downloading"](i, a) : u == "190" && r.waiting(i);
                        if (this.showSmartbar) {
                            var l = r._findBtn(i);
                            l.each(function() {
                                t.ondownloading(i, $(this), o)
                            })
                        }
                        n.downloadPackage[i] = {
                            downPath: o.savePath,
                            id: o.id,
                            pkgName: i,
                            status: u
                        }
                    }
            },
            _init: function() {
                this.btnStatusMgr = i.create(this.container, this.config.label || {}), this._bindEvents(), this.check(this.container)
            },
            _bindEvents: function() {
                var r = this,
                    i = this.btnStatusMgr;
                t.addEvent("installing", function(e) {
                    r.checkInstalling(e)
                }), t.addEvent("newpackage", function(e) {
                    e.action == "removed" ? (n.installedPackage[e.pkgname] = null, i.updateBtn("download", e.pkgname)) : e.action == "added" && (n.installedPackage[e.pkgname] = {}, i.updateBtn("open", e.pkgname), typeof window.__afterInstall__ == "function" && __afterInstall__(e.pkgname))
                }), $(document).delegate(".btn_install", "click", function(t) {
                    var r = $(this),
                        s = r.parents(".app-item").data("pname");
                    if (!s) return;
                    t.preventDefault(), t.stopPropagation();
                    var o = n.downloadPackage[s],
                        u = e.cmd("installAppFormId", o.id);
                    u == "-1" && (e.cmd("showMessage", "\u5b89\u88c5\u5305\u4e0d\u5b58\u5728\uff0c\u8bf7\u60a8\u91cd\u65b0\u4e0b\u8f7d"), i.updateBtn("download", s))
                })
            },
            create: function(e) {
                this.config = e || {}, this.container = this.config.container || $(document.body), this._init()
            },
            _updateStatus: function(e) {
                var e = e || this.container,
                    t = this.btnStatusMgr,
                    n = this;
                e.find(".app-item").each(function() {
                    var e = $(this),
                        r = e.data("pname"),
                        i = e.data("sid"),
                        s = n.getStatus(r);
                    s != "download" && t.updateBtn(s, r)
                })
            },
            check: function(e) {
                var n = this;
                t.ready("client_ready", function() {
                    n._updateStatus(e)
                })
            },
            ready: function(e) {
                t.ready("client_ready", function() {
                    e()
                })
            },
            start: function(e) {
                this.showSmartbar = !(e || {}).hideSmartbar, this.create(e)
            }
        },
        a = window.AndroidWebview_removePackage;
    window.AndroidWebview_removePackage = function(e) {
        a && a(e);
        if (qStore.util.cmd("isInstalled", e) == "true") return;
        var t = {};
        t[e] = {
            status: "490",
            progress: "0"
        }, u.checkInstalling(t)
    }, u.ondownloading = function(e, t, n) {
        var r = t.closest(".app-item"),
            i = r.data("size"),
            s = r.find(".install-status");
        if (!i) return;
        s.length == 0 && (r.find(".app-detail").append('<div class="install-status"><span class="status-net"></span><span class="status-size"><b style="visibility:hidden;">v</b></span><div class="prgbar"><p class="prgbar-bar"></p></div></div>'), s = r.find(".install-status"));
        var o = n.status,
            u = n.progress;
        if ("190,192,193,196".indexOf(o) < 0 && !n.isNetError || u == 100) {
            s.removeAttr("data-start").hide(), r.find(".app-grade").show(), r.find(".app-meta").show();
            return
        }
        r.find(".app-grade").hide(), r.find(".app-meta").hide(), s.show();
        var a = (new Date).getTime(),
            l = +(s.data("start") || "");
        l || (l = (new Date).getTime(), s.data("start", l));
        var c = Math.max(a - l, 500) / 1e3,
            h = s.find(".status-net");
        if (o == "193") h.html("\u5df2\u6682\u505c");
        else if (n.isNetError) h.html("\u7f51\u7edc\u5f02\u5e38");
        else {
            var p = i * u / c / 100;
            h.html(f(p) + "/s")
        }
        var d = s.find(".status-size"),
            v = f(i);
        d.html(f(i * u / 100, /M$/.test(v)) + "/" + v), r.find(".prgbar-bar").css("width", u + "%")
    }, window.AppStatusMgr = u
})();
