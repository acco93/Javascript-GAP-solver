/**
 * Application entry point.
 */

$(document).ready(function(){

    // Disable caching of AJAX responses
    $.ajaxSetup({
        cache: false
    });

    // load scripts
    $.when(
        $.getScript( "js/io/input.js" ),
        $.getScript( "js/io/output.js" ),
        $.getScript( "js/executor/singleWorkerExecutor.js" ),
        $.getScript( "js/localSearches/10opt.js" ),
        $.getScript( "js/localSearches/11opt.js" ),
        $.getScript( "js/localSearches/11moves.js" ),
        $.getScript( "js/localSearches/21moves.js" ),
        $.getScript( "js/metaheuristics/iteratedLocalSearch.js" ),
        $.getScript( "js/metaheuristics/simulatedAnnealing.js" ),
        $.getScript( "js/metaheuristics/tabuSearch.js" ),
        $.getScript( "js/solutionBuilders/constructiveHeuristic.js" ),
        $.getScript( "js/timer/countdown.js" ),
        $.getScript( "js/userInterface/handlers.js" ),
        $.getScript( "js/userInterface/timeHandler.js" ),
        $.getScript( "js/utilities/algorithmUtilities.js" ),
        $.getScript( "js/globalVariables.js" ),
        $.Deferred(function( deferred ){
            $( deferred.resolve );
        })
    ).done(function(){

        //console.log("Everything has been loaded.");

        bindHTMLElements();
        bindBehaviors();
        loadFiles();

    });





});

function loadFiles(){
    var li = '';
    var base_url = "http://astarte.csr.unibo.it/gapdata/";

    var urlList = $('#urlList');

    $.get("http://astarte.csr.unibo.it/gapdata/gapinstances.html", function(data){
        var html = $(data);
        var matches = $(html).find('[href]');
        urlList.empty();

        $.each(matches, function(i, el){
            var h = $(el).attr('href');
            if( h.indexOf(".json") > 0){
                var url = base_url + $(el).attr('href').trim().replace('\\','/');
                var fname = getFilename(url);

                urlList.append('<li><a href=\'javascript:void(0)\' onclick=\'changeUrl("'+url+'")\'>'+fname+'</a></li>');
            }
        });
    });

}

function bindHTMLElements() {
    // Bind all HTML elements to global variables
    HTMLElements.textArea = $('#textarea');
    HTMLElements.processButton = $('#processButton');
    HTMLElements.input = $('#input');
    HTMLElements.output = $("#output");
    HTMLElements.verboseLogButton = $("#verboseLogButton");
    HTMLElements.randomizeCustomersButton = $("#randomizeCustomersButton");
    HTMLElements.gap10Button = $("#gap10Button");
    HTMLElements.gap11Button = $("#gap11Button");
    HTMLElements.changelogBody = $("#changelogBody");
    HTMLElements.changelogModal = $("#changelogModal");
    HTMLElements.sa10Button = $("#sa10Button");
    HTMLElements.sa11Button = $("#sa11Button");
    HTMLElements.ts10Button = $("#ts10Button");
    HTMLElements.lastUpInfo = $("#lastUpInfo");
    HTMLElements.ils10Button = $("#ils10Button");
    HTMLElements.ils11Button = $("#ils11Button");
    HTMLElements.vnsButton = $("#vnsButton");
    HTMLElements.iterInput = $("#iterInput");
    HTMLElements.timeInput = $("#timeInput");
    HTMLElements.timeSpan = $("#timeSpan");
}

function bindBehaviors(){
    // Bind behaviors to actions
    HTMLElements.textArea.click(onTextAreaClick);
    HTMLElements.input.click(onInputClick);


    $.getJSON("https://api.bitbucket.org/2.0/repositories/acco93/gap-solver-js/?callback=", function( data ) {
        var htmlLastModified = new Date(document.lastModified);
        var repoLastUpdate = new Date(data.updated_on);

        if(htmlLastModified.getTime() - repoLastUpdate.getTime() > 0){
            HTMLElements.lastUpInfo.html('<small style="color: green;">UP TO DATE</small>');
        } else {
            HTMLElements.lastUpInfo.html('<small style="color: red;">Repo version is more updated!</small>');
        }

    });

    $(window).scroll(function(){
        if ($(this).scrollTop() > 100) {
            $('.scrollToTop').fadeIn();
        } else {
            $('.scrollToTop').fadeOut();
        }
    });

    //Click event to scroll to top
    $('.scrollToTop').click(function(){
        $('html, body').animate({scrollTop : 0},800);
        return false;
    });

    jQuery("#input").keyup(function () {
        var filter = jQuery(this).val();
        jQuery("ul li").each(function () {
            if (jQuery(this).text().search(new RegExp(filter, "i")) < 0 && jQuery(this).attr("id")!="listSearch") {
                jQuery(this).hide();
            } else {
                jQuery(this).show()
            }
        });

        dd=$("#dropdown");
        if(dd.attr("aria-expanded") == "false"){
            dd.dropdown('toggle');
        }

        $('#input').focus();
    });

}

function getFilename(url){
    url = url.split('/').pop().replace(/\#(.*?)$/, '').replace(/\?(.*?)$/, '');
    return url
}

