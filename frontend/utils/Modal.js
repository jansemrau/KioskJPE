//Modal
// Get the modal
var modal = document.getElementById("myModal");

// Get the main container and the body
var body = document.getElementsByTagName("body");
var container = document.getElementById("container");

// Get the close button
var btnClose = document.getElementById("sig-cancellationBtn");

// Close the modal
btnClose.onclick = function () {
    modal.className = "Modal is-hidden is-visuallyHidden";
    container.className = "container";
    container.parentElement.className = "";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.className = "Modal is-hidden";
        body.className = "";
        container.className = "container";
        container.parentElement.className = "";
    }
};
