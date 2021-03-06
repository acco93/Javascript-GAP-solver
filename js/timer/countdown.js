var Countdown = function (value, htmlElement) {

    this.startTime = +new Date();
    this.value = value;

    this.htmlElement = htmlElement;
    this.interval = undefined;
};

Countdown.prototype.start = function () {

    if (this.interval != undefined || this.value == undefined) {
        return;
    }



    var high = this.value * 0.6;
    var mid = this.value * 0.4;
    var low = this.value * 0.2;
    var current = undefined;

    var timeout = this.value;

    this.htmlElement.removeClass("red");
    this.htmlElement.removeClass("yellow");
    this.htmlElement.addClass("green");

    var outerThis = this;

    this.interval = setInterval(function () {

        if(current!= high && timeout > high){
            current = high;
            outerThis.htmlElement.removeClass("red");
            outerThis.htmlElement.addClass("green");
        } else if(current != mid && timeout>low && timeout <= high){
            current = mid;
            outerThis.htmlElement.removeClass("green");
            outerThis.htmlElement.addClass("yellow");
        } else if(current != low && timeout<=low){
            outerThis.htmlElement.removeClass("yellow");
            outerThis.htmlElement.addClass("red");
        }

        if (timeout >= 0) {
            timeout = (outerThis.startTime+outerThis.value) - new Date();
            outerThis.htmlElement.html(timeout + " ms");
        } else {
            outerThis.htmlElement.html("Time expired!");
            outerThis.stop();
        }

    }, 25);
};

Countdown.prototype.stop = function () {

    if (this.interval == undefined || this.value == undefined) {
        return;
    }

    clearInterval(this.interval);
	this.htmlElement.html("&nbsp;");
    this.interval = undefined;
};

