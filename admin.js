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
    await fetch("http://raspi:8000/kiosk/newParticipant", {
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
    await fetch(`http://raspi:8000/kiosk/participants/${id}`, {
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

const getAllParticipants = async () => {
    await fetch("http://raspi:8000/kiosk/getAllParticipants", {
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

        reihe.setAttribute("rowId", rowIdTeilnehmer++);
        reihe.setAttribute("personId", el._id);
        reihe.setAttribute("guthaben", el.guthaben);
        reihe.setAttribute("participantName", el.firstname + " " + el.lastname);

        reihe.addEventListener("click", function () {
            if (
                confirm(
                    "Bist du dir sicher, dass du diesen Teilnehmer löschen möchtest?"
                )
            ) {
                deleteParticipant(el._id);
            }
        });
    });
};

const getAllProductsTable = async () => {
    await fetch("http://raspi:8000/kiosk/getAllProducts", {
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
    await fetch("http://raspi:8000/kiosk/newProduct", {
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
    await fetch(`http://raspi:8000/kiosk/products/${id}`, {
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
