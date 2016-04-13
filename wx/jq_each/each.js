//http://mp.weixin.qq.com/s?__biz=MzAxODE2MjM1MA==&mid=403067212&idx=1&sn=465646b311873e5625dbba5f8fc72e6d&scene=1&srcid=0411B52oVCCWi1MwTYJSkST3#wechat_redirect
$("div").each(function(index, value) {

    //console.log("div" + index + " : " + $(this).attr("class"));

});
//test2 array
var arr = ["one", "two", "three", "four", "five"];
$.each(arr, function(index, value) {
        //      console.log(value);
        return (value !== "three");

    })
    //test3  object
var obj = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5
}
$.each(obj, function(index, value) {
    //console.log(index + " : " + value);
    return (value !== 3)

});
//遍历复杂的json对象
var json = [{
    'red': '#f00'
}, {
    'green': '#0f0'
}, {
    'blue': '#00f'
}];

$.each(json, function(index, val) {
    $.each(this, function(name, value) {
        console.log(name + " : " + value);

    });

});
