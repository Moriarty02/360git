//http://www.w3cplus.com/JavaScript/learning-javascript-native-functions-and-how-to-use-them.html

this.globalVar = {
    myglobalVarMethod = function() {}

};
console.log(this.globalVar);

//

this.globalVariable = "globalVariable";

function globalFunction() {
    this.innerVariable = "innerVariable";
    console.log(this.globalVariable === undefined);
    console.log(this.innerVariable === "innerVariable");
    return {
        innerFunction: function() {
            console.log(this.globalVariable === undefined);
            console.log(this.innerVariable === undefined);

        }

    }

}
globalFunction().innerFunction();
