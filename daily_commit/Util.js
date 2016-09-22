var Util = {
    version: 1.0,
    /**
     * log用于弹窗提示或者console.log
     * @         Author                   Moriarty
     * @DateTime 2016-01-25T15:39:36+0800
     * @param    {[type]}                 msg      [description]
     * @return   {[type]}                          [description]
     */
    log: function(msg) {
        try {
            AndroidWebview.showMessage(msg);
        } catch (e) {
            console.log(msg);

        }

    },
    /**
     * 提交到某个接口
     * @         Author                   Moriarty
     * @DateTime 2016-01-25T15:40:24+0800
     * @param    {[type]}                 sdata        send data
     * @param    {[type]}                 type         get||post
     * @param    {[type]}                 send_url      destinate url
     * @param    {[type]}                 callback_url  success url
     * @return   {[type]}                              [description]
     */
    do_ajax: function(sdata, type, send_url, callback_url) {
        $.ajax({
            type: type,
            url: send_url,
            data: sdata,
            dataType: 'json',
            timeout: 500,
            context: $('body'),
            success: function(data) {
                if (data.code == 0) {
                    if (typeof callback_url !== 'undefined') {
                        try {
                            AndroidWebview.openPage(callback_url);
                        } catch (e) {
                            console.log("goto page" + callback_url);
                        }
                    } else {
                        console.log(data);
                    }

                } else {
                    Util.log(data.msg);

                }
            },
            error: function(xhr, type) {
                Util.log("提交失败,请重试");
            }
        })

    },
    /**
     *  get info from the url
     * @         Author                   Moriarty
     * @DateTime 2016-01-25T15:42:20+0800
     * @return   {[type]}                 object  includes all location.search info
     */
    queryString: function() {
        var url = location.search;
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    },
    /**
     * get cookie by name
     * @         Author                   Moriarty
     * @DateTime 2016-01-25T15:43:17+0800
     * @param    {[type]}                 c_name   cookie-name
     * @return   {[type]}                          cookie-val
     */
    getCookie: function(c_name) {

        var name = "";
        var cookies = document.cookie.split(";");
        for (var i = 0, len = cookies.length; i < len; i++) {
            name = decodeURI(cookies[i].split("=")[0]);
            if (name === c_name) {
                return decodeURI(cookies[i].split("=")[1]);
            }
        }
        return "";

    },
    /**
     * set cookie
     * @         Author                   Moriarty
     * @DateTime 2016-01-25T15:43:52+0800
     * @param    {[type]}                 c_name   cookie name
     * @param    {[type]}                 c_val    cookie val
     * @param    {[type]}                 c_day    expire time (day)
     */
    setCookie: function(c_name, c_val, c_day) {

        var oDate = new Date();
        oDate.setDate(oDate.getDate() + c_day);
        try {
            document.cookie = c_name + '=' + c_val + ';expires=' + oDate;
            return true;
        } catch (e) {
            this.log("cookie设置失败")
            return false;
        }

    },
    /**
     * [removeCookie description]
     * @         Author                   Moriarty
     * @DateTime 2016-01-25T15:44:26+0800
     * @param    {[type]}                 c_name   cookie name
     * @return   {[type]}                          [description]
     */
    removeCookie: function(c_name) {

        try {
            this.setCookie(c_name, 1, -1);
            return true;

        } catch (e) {
            this.log("cookie删除失败");
            return false;
        }
    }
   
   


};

function getCookie(c_name) {

    var name = "";
    var cookies = document.cookie.split(";");
    for (var i = 0, len = cookies.length; i < len; i++) {
        name = decodeURI(cookies[i].split("=")[0]);
        if (name === c_name) {
            return decodeURI(cookies[i].split("=")[1]);
        }
    }
    return "";

}
