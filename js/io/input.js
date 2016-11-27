/**
 * Load a JSON from an URL or the text area according to the
 * global variable AppSettings.whatToProcess
 *
 * @returns a promise that will be resolved as the json object
 */
function loadJSON(){

    // Since I may have to asynchronously download it,
    // create a promise
    var deferred = new $.Deferred();

    if(AppSettings.whatToProcess == PASTED_CODE){

        // read the text area
        var text = HTMLElements.textArea.val();
        var json;

        // try to parse the JSON
        try {
            json = $.parseJSON(text);
        }catch(e) {
            deferred.resolve(undefined);
        }
        deferred.resolve(json);

    } else {

        // download the url from the specified url
        var url = HTMLElements.input.val();
        return downloadJSON(url);
    }

    // return the promise, so the user is able to wait for it or do whatever he wants
    return deferred.promise();
}

/**
 * Download a json from the given url
 * @param url: the url
 * @returns the promise
 */
function downloadJSON(url) {

    var startTime = new Date();

    // create a promise
    var deferred = new $.Deferred();

    $.getJSON( url, function( data ) {

        deferred.resolve(data);


    }).fail(function() {

        error("ERROR: Not able to get the JSON");

        deferred.resolve(undefined);

    }).always(function(){

        var endTime = new Date();

        info("Dowload time: "+(endTime-startTime)+" milliseconds.");

    });

    return deferred.promise();
}