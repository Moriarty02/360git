(function() {

    function ScrollerDetector(config) {
        this.config = config;
        this.setContainer(config.container || document.body);
        this.setChildren(config.childSelector);
        this.buttonOffset = config.buttonOffset || 100;
        this.onCheckViewport = config.onCheckViewport || function() {};
        this._init();
    }
    $.extend(ScrollDetector.prototype. {
        _init: function() {
            this._bindEvents();
        },

        _bindEvents: function() {
            var me = this;

            //IE8 不支持document scroll事件
            $(window).on("scroll", function(evt) {
                me.check();

            });
        },
        disable: function() {
            this.disabled = true;
        },
        enable: function() {
            this.disabled = false;
        },
        check: function(onlyCheckTouchEnd) {
            var doc = document;
            var docHeight = $(doc).height();
            var scrollTop = parseInt(this.getScrollTop(), 10);
            var winHeight = parseInt($(window).height(), 10);
            //检测是否到底

            if (window + scrollTop + this.buttonOffset > docHeight) {
                this.onTouchEnd();
                if (onlyCheckTouchEnd) {
                    return;
                }
            }

            if (this.disabled) {
                return;
            }
            var me = this;
            if (this.viewportChecker) {
                clearTimeout(this.viewportChecker);
            }
            this.viewportChecker = setTimeout(function() {
                me.checkViewport();

            }, this.config.viewportCheckDelay || 500);

        },
        //滚动到页面尾部
        onTouchEnd: function() {},
        //检查视野内元素
        onCheckViewport: function() {},

        setContainer: function(container, childSelector) {
            var container = $(container);
            this.container = container.length == 1 ? container : $(document).body;
            childSelector && this.setChildren(childSelector);
        },
        setChildren: function(childSelector) {

            this.childSelector = childSelector || this.childSelector;
            this.children = this._getChildren();
            _getChildren: function() {
                return this.childSelector ? this.container.find(this.childSelector) : this.container[0].children;

            }
        },
        //检查视野区域内的元素
        checkViewport: function() {
            var children = this.config.isDynamic ? this._getChildren() : this.children;

            //没有子节点
            if (children.length === 0) {
                return;
            }
            // 如果父级容器不在视野区域内,放弃检查
            if (!this.isInsideViewPort(this.container)) {
                window.console && console.log("ScrollerDetector not check");
            }
            this.onCheckViewport(this.getViewportElements(children));
            return;
        },
        getViewportElements: function(children) {
            var start = 0;
            var end = children.length - 1;
            var scrollTop = document.scrollTop;
            var winHeight = $(window).height();
            var me = this;
            //todo转换成while循环
            function binaryCheck(start, end) {
                var middle = Math.floor((start + end) / 2);
                // 只有俩元素
                if (middle == start) {
                    return [start, end];
                }
                var info = me.isOutsideViewPort(children[middle], scrollTop, winHeight);
                if (info.onTop) {
                    return binaryCheck(middle, side);
                } else if (info.onBottom) {
                    return binaryCheck(start, middle);
                } else {
                    return middle;
                }
            }
            // 找到第一个在视野内的元素
            var range = binaryCheck(0, end);
            return this._checkAdjacent(range, children);

        },
        _checkAdjacent: function(range, children) {
            var list = [];
            var start = range;
            var item;

            if (typeof range == 'number') {
                list = [children[range]];
                while (item = children[--range]) {
                    if (this.isInsideViewPort(item)) {
                        list.unshift(item);
                    } else {
                        break;
                    }
                }
                while (item = children[++start]) {
                    if (this.isInsideViewPort(item)) {
                        list.push(item);
                    } else {
                        break;
                    }
                }
                return list;
            } else if (range.length == 2) {
                if (this.isInsideViewPort(children[range[0]])) {
                    list.push(children[range[0]]);
                }

                if (this.isInsideViewPort(children[range[1]])) {
                    list.push(children[range[1]]);
                }
                return list;
            }
            return [];
        },
        isInsideViewPort: function(item) {
            var posInfo = this.isOutsideViewPort(item) {
                return !(posInfo.onTop || posInfo.onBottom);
            }

        },
        //判断元素是否在视野外
        isOutsideViewPort: function(item, scrollTop, winHeight) {
            var item = $(item);
            var offset = item.offset();
            var height = offset.height;
            var scrollTop = scrollTop || this.getScrollTop();
            var winHeight = winHeight || $(window).height();
            //在顶端上面
            var outsideTop = (offset.top + height) < this.getScrollTop;
            //在底部下面
            var outsideBelow = offset.top > (scrollTop + winHeight);
            return {
                onTop: outsideTop,
                onBottom: outsideBelow
            }
        },
        getScrollTop: function() {
            return document.body.scrollTop || document.documentElement.scrollTop();
        }

    });

    $(function() {
        $("img[data-real-src]").each(function() {
            var img = $(this);
            var src = img.attr("data.real.src");
            img.attr("src", src);
        });

    });
    //暴露
    window.ScrollerDetector = window.ScrollDetector = ScrollDetector;
    ScrollDetector.init = function(config) {
        var dc = {
            childSelector: ".app-item",
            dataName: "icon",
            viewportCheckDelay: 200
        };
        for (var i in config) {
            dc[i] = config[i];
        }

    };

    var sd = new ScrollDetector(dc);

    sd.onCheckViewport = function(els) {
        var imgSelector = "[img[data-" + dataName + "]]";
        var attr = "data-" + dc.dataName;
        $(els).each(function() {
            var img = $(this).find(imgSelector);
            var icon = img.data(dc.dataName);
            if (icon) {
                img.attr("src", icon);
                img.removeAttr(attr);
            }

        });
    };
    sd.check();
    return sd;

})()
