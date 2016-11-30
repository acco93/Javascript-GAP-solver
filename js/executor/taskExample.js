// define the function
function reply(){

    self.addEventListener("message", function (parameters) {

        // do processing

        setTimeout(function() {
            var result = parameters.data.p1 + parameters.data.p2;

            postMessage(result);
        }, 5000);



    });


}

// call the function
reply();