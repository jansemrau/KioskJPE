let guthabenAlt = 0;
let guthabenNeu = guthabenAlt;
let sum = 0;
let rowIdTeilnehmer = 0;
let rowIdEinkauf = 0;
let participants = [];
let products = [];
let currentId = 0;

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

const speichern = async () => {
    console.log(currentId);
    await fetch(`http://raspi:8000/kiosk/participants/${currentId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            guthaben: guthabenNeu,
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

const getAllProducts = async () => {
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
                products = parsedJson.data.products;
                createProducts();
                createProductsTable();
            }
        });
    });
};

getAllParticipants();
getAllProducts();

const createProducts = () => {
    console.log(products);
    const suessigkeitenContainer = document.getElementById(
        "suessigkeitenContainer"
    );
    for (let i = 0; i < products.length; i++) {
        const button = document.createElement("button");
        button.setAttribute("class", "suessigkeit");
        button.addEventListener("click", function () {
            inDenEinkaufswagen(i, products[i].name, products[i].price);
        });
        button.innerHTML = `${products[i].name} <br> ${products[i].price} €`;
        suessigkeitenContainer.insertAdjacentElement("beforeend", button);
    }
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
            if (rowIdEinkauf > 0) {
                if (
                    confirm(
                        "Bist du dir sicher? Du hast noch nicht gespeichert!"
                    )
                ) {
                    clearEinkauf();
                    auswahl(
                        this.getAttribute("personId"),
                        this.getAttribute("guthaben"),
                        this.getAttribute("participantName")
                    );
                    currentId = this.getAttribute("personId");
                }
            } else {
                console.log(currentId);
                clearEinkauf();
                auswahl(
                    this.getAttribute("personId"),
                    this.getAttribute("guthaben"),
                    this.getAttribute("participantName")
                );
                currentId = this.getAttribute("personId");
            }
        });
    });
};

function zeileEinfuegenEinkauf(artikelId, artikelName, preis) {
    const tabelle = document.getElementById("tabelleEinkauf");
    // schreibe Tabellenzeile
    const reihe = tabelle.insertRow(-1);
    let vorname = artikelName,
        zelle1 = reihe.insertCell();
    zelle1.innerHTML = vorname;

    let nachname = preis,
        zelle2 = reihe.insertCell();
    zelle2.innerHTML = nachname;

    reihe.setAttribute("rowId", rowIdEinkauf++);
    reihe.setAttribute("artikelId", artikelId);
    reihe.setAttribute("preis", preis);

    reihe.addEventListener("click", function () {
        if (confirm("Artikel wirklich löschen?")) {
            ausDemEinkaufswagen(parseFloat(this.getAttribute("preis")));
        }
    });
}

const auswahl = (personId, guthaben, name) => {
    guthabenAlt = guthaben;
    guthabenNeu = guthabenAlt;
    document.getElementById("participantName").innerHTML = name;
    document.getElementById("guthabenAlt").innerHTML = `Alt: ${guthabenAlt} €`;
    document.getElementById("guthabenNeu").innerHTML = `Neu: ${guthabenNeu} €`;
};

const checkGuthaben = (preis) => {
    return guthabenNeu - preis >= 0 ? true : false;
};
const clear = () => {
    clearEinkauf();
    const tabelleTeilnehmer = document.getElementById("tabelleTeilnehmer");
    for (let i = rowIdTeilnehmer; i > 0; i--) {
        tabelleTeilnehmer.deleteRow(i);
    }
    rowIdTeilnehmer = 0;
    document.getElementById("participantName").innerHTML = name;
};
const clearEinkauf = () => {
    const tabelleEinkauf = document.getElementById("tabelleEinkauf");
    for (let i = rowIdEinkauf; i > 0; i--) {
        tabelleEinkauf.deleteRow(i);
    }
    guthabenAlt = 0;
    guthabenNeu = 0;
    sum = 0;
    rowIdEinkauf = 0;
    currentId = 0;
    document.getElementById("guthabenAlt").innerHTML = `Alt: ${guthabenAlt} €`;
    document.getElementById("guthabenNeu").innerHTML = `Neu: ${guthabenNeu} €`;
    document.getElementById("sum").innerHTML = `Summe: ${sum} €`;
};
const inDenEinkaufswagen = (artikelId, artikelName, preis) => {
    if (checkGuthaben(preis)) {
        sum += preis;
        sum = parseFloat(sum.toFixed(2));
        guthabenNeu -= preis;
        guthabenNeu = parseFloat(guthabenNeu.toFixed(2));

        document.getElementById(
            "guthabenNeu"
        ).innerHTML = `Neu: ${guthabenNeu} €`;
        document.getElementById("sum").innerHTML = `Sum: ${sum} €`;

        zeileEinfuegenEinkauf(artikelId, artikelName, preis);
    } else {
        alert("Nicht genug Guthaben");
    }
};

const ausDemEinkaufswagen = (preis) => {
    const tabelle = document.getElementById("tabelleEinkauf");
    tabelle.deleteRow(rowIdEinkauf);
    sum -= preis;
    sum = parseFloat(sum.toFixed(2));
    guthabenNeu += preis;
    guthabenNeu = parseFloat(guthabenNeu.toFixed(2));
    rowIdEinkauf--;

    document.getElementById("guthabenNeu").innerHTML = `Neu: ${guthabenNeu} €`;
    document.getElementById("sum").innerHTML = `Sum: ${sum} €`;
};