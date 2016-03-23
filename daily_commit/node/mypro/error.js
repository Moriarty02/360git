function c() {
    b();
}

function b() {
    a();
}

function a() {
    setTimeout(function() {
        throw new Error("here");

    }, 1000)
}
c();
