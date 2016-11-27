/**
 * Application entry point.
 */

$(document).ready(function(){

    // Disable caching of AJAX responses
    $.ajaxSetup({
        cache: false
    });

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

});

