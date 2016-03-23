//javascript patten

//model
(function() {
    // declare private variables and/or functions
    return {
        // declare public variables and/or functions
    }

})()


//detail
var HTMLChanger = (function() {

    var HTMLContent = "contents";
    var changeHTML = function() {
        var odom = document.getElementById("attr-id");
        odom.innerHTML = HTMLContent;
    }
    return {
        callChangeHTML : function() {

            changeHTML();
            console.log(HTMLContent);

        }

    }

})();

HTMLChanger.callChangeHTML();
console.log(HTMLContent);

//Revealing Module Pattern
