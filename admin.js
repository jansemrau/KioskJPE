let productsTable = [];
let rowIdProducts = 0;
let guthabenAlt = 0;
let guthabenNeu = guthabenAlt;
let sum = 0;
let rowIdTeilnehmer = 0;
let rowIdEinkauf = 0;
let participants = [];
let products = [];
let currentId = 0;

const newParticipant = async () => {
    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    let guthaben = document.getElementById("guthaben").value;
    if (guthaben.indexOf(",") > -1) {
        guthaben = guthaben.replace(",", ".");
        parseFloat(guthaben);
    } else {
        parseFloat(guthaben);
    }
    await fetch("http://localhost:8000/kiosk/newParticipant", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            firstname: firstname,
            lastname: lastname,
            guthaben: guthaben,
        }),
    }).then((response) => {
        response.json().then((parsedJson) => {
            console.log(parsedJson);
            if (parsedJson.status !== "success") {
                errorElement(parsedJson.message);
            } else {
                location.reload();
            }
        });
    });
};

const deleteParticipant = async (id) => {
    await fetch(`http://localhost:8000/kiosk/participants/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {
        response.json().then((response) => {
            console.log(response);
        });
        location.reload();
    });
};

const auszahlen = async (dataUrl) => {
    console.log(currentId);
    await fetch(`http://localhost:8000/kiosk/participants/${currentId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            signature: dataUrl,
        }),
    }).then((response) => {
        response.json().then((parsedJson) => {
            console.log(parsedJson);
            if (parsedJson.status !== "success") {
                errorElement(parsedJson.message);
            } else {
                clear();
                getAllParticipants();
            }
        });
    });
};

const getAllParticipants = async () => {
    await fetch("http://localhost:8000/kiosk/getAllParticipants", {
        method: "Get",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {
        response.json().then((parsedJson) => {
            console.log(parsedJson);
            if (parsedJson.status !== "success") {
                errorElement(parsedJson.message);
            } else {
                console.log(parsedJson.data.participants);
                participants = parsedJson.data.participants;
                zeileEinfuegenTeilnehmer();
            }
        });
    });
};

const zeileEinfuegenTeilnehmer = () => {
    const tabelle = document.getElementById("tabelleTeilnehmer");
    // schreibe Tabellenzeile
    participants.forEach((el) => {
        const reihe = tabelle.insertRow(-1);
        let vorname = el.firstname,
            zelle1 = reihe.insertCell();
        zelle1.innerHTML = vorname;

        let nachname = el.lastname,
            zelle2 = reihe.insertCell();
        zelle2.innerHTML = nachname;

        let gehalt = el.guthaben,
            zelle3 = reihe.insertCell();
        zelle3.innerHTML = gehalt;

        //Aktion
        let deleteButton = document.createElement("button");
        deleteButton.setAttribute("class", "button");
        deleteButton.innerHTML = "Löschen";
        deleteButton.addEventListener("click", function () {
            if (
                confirm(
                    "Bist du dir sicher, dass du diesen Teilnehmer löschen möchtest?"
                )
            ) {
                deleteParticipant(el._id);
            }
        });

        let auszahlenButton = document.createElement("button");
        auszahlenButton.setAttribute("class", "button");
        auszahlenButton.innerHTML = "auszahlen";
        auszahlenButton.addEventListener("click", function () {
            if (
                confirm(
                    "Bist du dir sicher, dass du den Betrag auszahlen möchtest?"
                )
            ) {
                modal.className = "Modal is-visuallyHidden";
                setTimeout(function () {
                    container.className = "container is-blurred";
                    modal.className = "Modal";
                }, 100);
                container.parentElement.className = "ModalOpen";
                signature();
            }
        });

        let zelle4 = reihe.insertCell();
        zelle4.appendChild(deleteButton);
        zelle4.appendChild(auszahlenButton);

        reihe.setAttribute("rowId", rowIdTeilnehmer++);
        reihe.setAttribute("personId", el._id);
        reihe.setAttribute("guthaben", el.guthaben);
        reihe.setAttribute("participantName", el.firstname + " " + el.lastname);
    });
};

const getAllProductsTable = async () => {
    await fetch("http://localhost:8000/kiosk/getAllProducts", {
        method: "Get",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {
        response.json().then((parsedJson) => {
            console.log(parsedJson);
            if (parsedJson.status !== "success") {
                errorElement(parsedJson.message);
            } else {
                console.log(parsedJson.data.products);
                productsTable = parsedJson.data.products;
                createProductsTable();
            }
        });
    });
};

function createProductsTable() {
    const tabelle = document.getElementById("tabelleProdukte");
    // schreibe Tabellenzeile
    console.log("Produkte" + productsTable);
    productsTable.forEach((el) => {
        const reihe = tabelle.insertRow(-1);
        let name = el.name,
            zelle1 = reihe.insertCell();
        zelle1.innerHTML = name;

        let price = el.price,
            zelle2 = reihe.insertCell();
        zelle2.innerHTML = price;

        reihe.setAttribute("rowId", rowIdProducts++);
        reihe.setAttribute("ProductId", el._id);

        reihe.addEventListener("click", function () {
            if (
                confirm(
                    "Bist du dir sicher, dass du das Produkt löschen möchtest?"
                )
            ) {
                deleteProduct(el._id);
            }
        });
    });
}

const newProduct = async () => {
    const name = document.getElementById("name").value;
    let price = document.getElementById("price").value;
    if (price.indexOf(",") > -1) {
        price = price.replace(",", ".");
        parseFloat(price);
    } else {
        parseFloat(price);
    }
    await fetch("http://localhost:8000/kiosk/newProduct", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name,
            price: price,
        }),
    }).then((response) => {
        response.json().then((parsedJson) => {
            console.log(parsedJson);
            if (parsedJson.status !== "success") {
                errorElement(parsedJson.message);
            } else {
                location.reload();
            }
        });
    });
};

const deleteProduct = async (id) => {
    await fetch(`http://localhost:8000/kiosk/products/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {
        console.log(response);
    });
    location.reload();
};

getAllParticipants();
getAllProductsTable();

//Signature
const signature = () => {
    window.requestAnimFrame = (function (callback) {
        return (
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimaitonFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            }
        );
    })();

    var canvas = document.getElementById("sig-canvas");
    var ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#222222";
    ctx.lineWidth = 4;

    var element = document.getElementById("canvasContainer");
    var positionInfo = element.getBoundingClientRect();
    ctx.canvas.width = positionInfo.width;
    ctx.canvas.height = positionInfo.height - 40;

    var drawing = false;
    var mousePos = {
        x: 0,
        y: 0,
    };
    var lastPos = mousePos;

    canvas.addEventListener(
        "mousedown",
        function (e) {
            drawing = true;
            lastPos = getMousePos(canvas, e);
        },
        false
    );

    canvas.addEventListener(
        "mouseup",
        function (e) {
            drawing = false;
        },
        false
    );

    canvas.addEventListener(
        "mousemove",
        function (e) {
            mousePos = getMousePos(canvas, e);
        },
        false
    );

    // Add touch event support for mobile
    canvas.addEventListener("touchstart", function (e) {}, false);

    canvas.addEventListener(
        "touchmove",
        function (e) {
            var touch = e.touches[0];
            var me = new MouseEvent("mousemove", {
                clientX: touch.clientX,
                clientY: touch.clientY,
            });
            canvas.dispatchEvent(me);
        },
        false
    );

    canvas.addEventListener(
        "touchstart",
        function (e) {
            mousePos = getTouchPos(canvas, e);
            var touch = e.touches[0];
            var me = new MouseEvent("mousedown", {
                clientX: touch.clientX,
                clientY: touch.clientY,
            });
            canvas.dispatchEvent(me);
        },
        false
    );

    canvas.addEventListener(
        "touchend",
        function (e) {
            var me = new MouseEvent("mouseup", {});
            canvas.dispatchEvent(me);
        },
        false
    );

    function getMousePos(canvasDom, mouseEvent) {
        var rect = canvasDom.getBoundingClientRect();
        return {
            x: mouseEvent.clientX - rect.left,
            y: mouseEvent.clientY - rect.top,
        };
    }

    function getTouchPos(canvasDom, touchEvent) {
        var rect = canvasDom.getBoundingClientRect();
        return {
            x: touchEvent.touches[0].clientX - rect.left,
            y: touchEvent.touches[0].clientY - rect.top,
        };
    }

    function renderCanvas() {
        if (drawing) {
            ctx.moveTo(lastPos.x, lastPos.y);
            ctx.lineTo(mousePos.x, mousePos.y);
            ctx.stroke();
            lastPos = mousePos;
        }
    }

    // Prevent scrolling when touching the canvas
    document.body.addEventListener(
        "touchstart",
        function (e) {
            if (e.target == canvas) {
                e.preventDefault();
            }
        },
        false
    );
    document.body.addEventListener(
        "touchend",
        function (e) {
            if (e.target == canvas) {
                e.preventDefault();
            }
        },
        false
    );
    document.body.addEventListener(
        "touchmove",
        function (e) {
            if (e.target == canvas) {
                e.preventDefault();
            }
        },
        false
    );

    (function drawLoop() {
        requestAnimFrame(drawLoop);
        renderCanvas();
    })();

    function clearCanvas() {
        canvas.width = canvas.width;
    }

    // Set up the UI
    var clearBtn = document.getElementById("sig-clearBtn");
    var submitBtn = document.getElementById("sig-submitBtn");
    clearBtn.addEventListener(
        "click",
        function (e) {
            clearCanvas();
        },
        false
    );
    submitBtn.addEventListener(
        "click",
        function (e) {
            var dataUrl = canvas.toDataURL();
            console.log(auszahlen(dataUrl));
        },
        false
    );
};

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
