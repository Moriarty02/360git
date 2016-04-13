(function() {

    function ScrollerDector(config) {
        this.config = config;;
        this.setContainer(config.container || document.body);
        this.setChildren(config.childSelector);
        this.buttomOffset = config.buttomOffset || 100;
        this.onCheckViewport = config.onCheckViewport || function() {};
        this._init();

    }

    $.extend(ScrollerDector.prototype, {

        _init: function() {
            this._bindEvents();
        },
        _bindEvents: function() {
            var me = this;
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
            if (winHeight + scrollTop + this.buttomOffset > docHeight) {
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
            this.viewportChecker=setTimeout(function(){
            	me.checkViewport();

            },this.config.viewportCheckDelay||500);
        },

        onTouchEnd:function(){},
        onCheckViewport:function(){},
        setContainer:function(container,childSelector){
        	var con

        }

    })


})()
