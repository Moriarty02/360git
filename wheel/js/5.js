//计算半径为r的圆周长
var circle_length = function(radius) {
    return 2 * Math.PI * radius;

}


var squire = function(radius, h) {
    return circle_length(radius) * h;
}

var max = function(a) {
    var larger = a[0];
    for (var i = 0, leng = a.length; i < leng; i++) {
        if (a[i] > larger) {
            larger = a[i];
        }
        return larger;

    }

}

function runOnce(fn, context) {
    return function() {
        try {
            fn.apply(context || this, arguments);
        } catch (e) {
            console.log(e);
        } finally {
            fn = null;
        }


    }


}
