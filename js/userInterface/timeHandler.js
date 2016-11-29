var DAYS = 0;
var HOURS = 1;
var MINUTES = 2;
var SECONDS = 3;
var MILLISECONDS = 4;

var CURRENT_TIME_UNIT = SECONDS;
function handleTime(unit) {

    var timeInputSpan = $("#timeInputSpan");

    CURRENT_TIME_UNIT = unit;

    switch (unit) {
        case DAYS:
            timeInputSpan.html("days");
            break;
        case HOURS:
            timeInputSpan.html("hours");
            break;
        case MINUTES:
            timeInputSpan.html("minutes");
            break;
        case SECONDS:
            timeInputSpan.html("seconds");
            break;
        case MILLISECONDS:
            timeInputSpan.html("milliseconds");
            break;
        default:
            timeInputSpan.html("seconds");
            CURRENT_TIME_UNIT = SECONDS;
            break;
    }
}

function getProcessingTime() {
    var time = HTMLElements.timeInput.val();
    switch (CURRENT_TIME_UNIT) {
        case DAYS:
            time *=1000*60*60*24;
            break;
        case HOURS:
            time *= 1000*60*60;
            break;
        case MINUTES:
            time *= 1000*60;
            break;
        case SECONDS:
            time *= 1000;
            break;
        case MILLISECONDS:
            break;
    }
    return time;
}