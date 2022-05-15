let productsTable = [];
let rowIdProducts = 0;
let guthabenAlt = 0;
let guthabenNeu = guthabenAlt;
let sum = 0;
let rowIdTeilnehmer = 0;
let rowIdEinkauf = 0;
let participants = [];
let products = [];

let path = "http://89.22.122.138";

const validateUser = async () => {
    await fetch(`${path}/auth/welcome`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("authToken"),
        },
        body: JSON.stringify({}),
    }).then((response) => {
        console.log(response);
        if (response.status === 401 || response.status === 403) {
            console.log("not authenticated");
            window.location.href = `${path}/authentication`;
        }
    });
};

const newParticipant = async () => {
    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    let guthaben = document.getElementById("guthaben").value;
    let isValid = /^[0-9,.]*$/.test(guthaben);
    if (!isNaN(isValid)) {
        if (guthaben.indexOf(",") > -1) {
            guthaben = guthaben.replace(",", ".");
            guthaben = parseFloat(guthaben);
        } else {
            guthaben = parseFloat(guthaben);
        }
        await fetch("http://89.22.122.138:8000/kiosk/newParticipant", {
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
                if (parsedJson.status !== "success") {
                    errorElement(parsedJson.message);
                } else {
                    location.reload();
                }
            });
        });
    } else {
        alert("Kein gültiges Guthaben eingegeben, bitte neu eingeben");
        location.reload();
    }
<<<<<<< HEAD:admin.js
    await fetch(`${path}/kiosk/newParticipant`, {
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
            if (parsedJson.status !== "success") {
                errorElement(parsedJson.message);
            } else {
                location.reload();
            }
        });
    });
};

const deleteParticipant = async (id) => {
    await fetch(`${path}/kiosk/participants/${id}`, {
=======
};

const deleteParticipant = async (id) => {
    await fetch(`http://89.22.122.138:8000/kiosk/participants/${id}`, {
>>>>>>> 509407c58371f565f7d8730a1c8b96bf17adf883:frontend/admin.js
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {
        location.reload();
    });
};

<<<<<<< HEAD:admin.js
const auszahlen = async (currentId, dataUrl) => {
    let datum = Date.now();
    await fetch(`${path}/kiosk/participants/${currentId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            signature: dataUrl,
            datumAuszahlung: datum,
        }),
    }).then((response) => {
        response.json().then((parsedJson) => {
            if (parsedJson.status !== "success") {
                errorElement(parsedJson.message);
            } else {
                location.reload();
            }
        });
    });
};

const getAllParticipants = async () => {
    await fetch(`${path}/kiosk/getAllParticipants`, {
=======
const getAllParticipants = async () => {
    await fetch("http://89.22.122.138:8000/kiosk/getAllParticipants", {
>>>>>>> 509407c58371f565f7d8730a1c8b96bf17adf883:frontend/admin.js
        method: "Get",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {
        response.json().then((parsedJson) => {
            if (parsedJson.status !== "success") {
                errorElement(parsedJson.message);
            } else {
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

        if (!el.signature) {
            let gehalt = el.guthaben,
                zelle3 = reihe.insertCell();
            zelle3.innerHTML = `${gehalt} €`;
        } else {
            let datumAlt = new Date(el.datumAuszahlung);
            let datum =
                ("0" + datumAlt.getDate()).slice(-2) +
                "." +
                ("0" + (datumAlt.getMonth() + 1)).slice(-2) +
                "." +
                datumAlt.getFullYear() +
                ", " +
                ("0" + datumAlt.getHours()).slice(-2) +
                ":" +
                ("0" + datumAlt.getMinutes()).slice(-2) +
                " Uhr";
            let gehalt = el.guthaben,
                zelle3 = reihe.insertCell();
            zelle3.innerHTML = `${gehalt} € ausgezahlt am ${datum}`;
        }
        reihe.setAttribute("personId", el._id);
        //Aktion
        let deleteButton = document.createElement("button");
        deleteButton.setAttribute("class", "button button--fullwidth");
        deleteButton.innerHTML = "Löschen";
        deleteButton.addEventListener("click", function () {
            deleteParticipant(el._id);
        });

        let auszahlenButton = document.createElement("button");
        if (el.signature) {
            auszahlenButton.setAttribute(
                "class",
                "button button--ausgezahlt button--fullwidth"
            );
            auszahlenButton.innerHTML = "Ausgezahlt";
            auszahlenButton.addEventListener("click", function () {
                modal.className = "Modal is-visuallyHidden";
                setTimeout(function () {
                    container.className = "container is-blurred";
                    modal.className = "Modal";
                }, 100);
                container.parentElement.className = "ModalOpen";
                var image = new Image();
                image.src = el.signature;
                let canvasContainer = document.getElementById("modal-canvas");
                canvasContainer.style.display = "none";
                let imageContainer = document.getElementById(
                    "modal-image-container"
                );
                imageContainer.style.display = "block";
                let images = document.getElementById("modal-image");
                images.style.display = "block";
                images.appendChild(image);

                let closeButton = document.getElementById(
                    "sig-cancellationBtnImage"
                );

                // Close the modal
                closeButton.onclick = function () {
                    modal.className = "Modal is-hidden is-visuallyHidden";
                    container.className = "container";
                    container.parentElement.className = "";
                    let modalImageContainer =
                        document.getElementById("modal-image");
                    modalImageContainer.removeChild(
                        modalImageContainer.lastChild
                    );
                };
            });
        } else {
            auszahlenButton.setAttribute("class", "button button--fullwidth");
            auszahlenButton.innerHTML = "Auszahlen";
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
                    signature(el._id);
                }
            });
        }

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
<<<<<<< HEAD:admin.js
    await fetch(`${path}/kiosk/getAllProducts`, {
=======
    await fetch("http://89.22.122.138:8000/kiosk/getAllProducts", {
>>>>>>> 509407c58371f565f7d8730a1c8b96bf17adf883:frontend/admin.js
        method: "Get",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {
        response.json().then((parsedJson) => {
            if (parsedJson.status !== "success") {
                errorElement(parsedJson.message);
            } else {
                productsTable = parsedJson.data.products;
                createProductsTable();
            }
        });
    });
};

function createProductsTable() {
    const tabelle = document.getElementById("tabelleProdukte");
    // schreibe Tabellenzeile
    productsTable.forEach((el) => {
        const reihe = tabelle.insertRow(-1);
        let name = el.name,
            zelle1 = reihe.insertCell();
        zelle1.innerHTML = name;

        let price = el.price,
            zelle2 = reihe.insertCell();
        zelle2.innerHTML = `${price} €`;

        let deleteButton = document.createElement("button");
        deleteButton.setAttribute("class", "button button--fullwidth");
        deleteButton.innerHTML = "Löschen";
        deleteButton.addEventListener("click", function () {
            if (
                confirm(
                    "Bist du dir sicher, dass du dieses Produkt löschen möchtest?"
                )
            ) {
                deleteProduct(el._id);
            }
        });

        let zelle3 = reihe.insertCell();
        zelle3.appendChild(deleteButton);

        reihe.setAttribute("rowId", rowIdProducts++);
        reihe.setAttribute("ProductId", el._id);
    });
}

const newProduct = async (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    let price = document.getElementById("price").value;
    let isValid = /^[0-9,.]*$/.test(price);
    if (!isNaN(isValid)) {
        if (price.indexOf(",") > -1) {
            price = price.replace(",", ".");
            price = parseFloat(price);
        } else {
            price = parseFloat(price);
        }
        await fetch("http://89.22.122.138:8000/kiosk/newProduct", {
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
                if (parsedJson.status !== "success") {
                    errorElement(parsedJson.message);
                } else {
                    location.reload();
                }
            });
        });
    } else {
        alert("Keinen gültigen Preis eingegeben, bitte neu eingeben");
        location.reload();
    }
<<<<<<< HEAD:admin.js
    await fetch(`${path}/kiosk/newProduct`, {
        method: "POST",
=======
};

const deleteProduct = async (id) => {
    await fetch(`http://89.22.122.138:8000/kiosk/products/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {
        location.reload();
    });
};

const auszahlen = async (currentId, dataUrl) => {
    let datum = Date.now();
    await fetch(`http://89.22.122.138:8000/kiosk/participants/${currentId}`, {
        method: "PATCH",
>>>>>>> 509407c58371f565f7d8730a1c8b96bf17adf883:frontend/admin.js
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            signature: dataUrl,
            datumAuszahlung: datum,
        }),
    }).then((response) => {
        response.json().then((parsedJson) => {
            if (parsedJson.status !== "success") {
                errorElement(parsedJson.message);
            } else {
                location.reload();
            }
        });
    });
};

<<<<<<< HEAD:admin.js
const deleteProduct = async (id) => {
    await fetch(`${path}/kiosk/products/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {
        location.reload();
    });
};

const signOut = () => {
    window.localStorage.removeItem("authToken");
    window.location.reload();
};

getAllParticipants();
getAllProductsTable();

validateUser();

//Signature
const signature = (currentId) => {
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
            auszahlen(currentId, dataUrl);
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
=======
getAllParticipants();
getAllProductsTable();
>>>>>>> 509407c58371f565f7d8730a1c8b96bf17adf883:frontend/admin.js
