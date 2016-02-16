/*
old code
 */
function validate(value) {
    if (!value) {
        alert("invalid 	value");
        location.href = "./errors/index.php";
    }

}

function toggleSelected(element) {
    if (hasClass(element, "selected")) {
        removeClass("selected");
    } else {
        addClass("selected");
    }

}
//new code
//将配置数据抽取出来
var config = {
    MSG_INVALID: 'invalid value',
    URL_INVALID: "./errors/index.php",
    CSS_SELECTED: "selected"
}

function validate(value) {
    if (!value) {
        alert(config.MSG_INVALID);
        location.href = config.URL_INVALID;
    }

}

function toggleSelected(element) {
    if (hasClass(element, config.CSS_SELECTED)) {
        removeClass(element,config.CSS_SELECTED);
    } else {
        addClass(element,config.CSS_SELECTED)
    }
}
