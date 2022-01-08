let guthabenAlt = 0;
let guthabenNeu = guthabenAlt;
let sum = 0;
let rowIdTeilnehmer = 0;
let rowIdEinkauf = 1;
let participants = [];
let products = [];
let currentId = 0;

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

const appHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty("--app-height", `${window.innerHeight}px`);
};
window.addEventListener("resize", appHeight);
appHeight();

const getAllParticipants = async () => {
    await fetch("http://89.22.122.138:8000/kiosk/getAllParticipants", {
        method: "Get",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(handleErrors)
        .then((response) => {
            response.json().then((parsedJson) => {
                if (parsedJson.status !== "success") {
                    errorElement(parsedJson.message);
                } else {
                    participants = parsedJson.data.participants;
                    zeileEinfuegenTeilnehmer();
                }
            });
        })
        .catch((error) => {
            //Here is still promise
            console.log(error);
            errorElement(error);
        });
};

const speichern = async () => {
    await fetch(`http://89.22.122.138:8000/kiosk/participants/${currentId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            guthaben: guthabenNeu,
        }),
    })
        .then(handleErrors)
        .then((response) => {
            response.json().then((parsedJson) => {
                if (parsedJson.status !== "success") {
                    errorElement(parsedJson.message);
                } else {
                    clear();
                    getAllParticipants();
                }
            });
        })
        .catch((error) => {
            //Here is still promise
            console.log(error);
            errorElement(error);
        });
};

const getAllProducts = async () => {
    await fetch("http://89.22.122.138:8000/kiosk/getAllProducts", {
        method: "Get",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(handleErrors)
        .then((response) => {
            response.json().then((parsedJson) => {
                if (parsedJson.status !== "success") {
                    errorElement(parsedJson.message);
                } else {
                    products = parsedJson.data.products;
                    createProducts();
                    toggleLightDark();
                }
            });
        })
        .catch((error) => {
            //Here is still promise
            console.log(error);
            errorElement(error);
        });
};

const createProducts = async () => {
    const suessigkeitenContainer = document.getElementById(
        "suessigkeitenContainer"
    );
    for (let i = 0; i < products.length; i++) {
        const button = document.createElement("button");
        button.setAttribute("class", "suessigkeit");
        button.addEventListener("click", function () {
            inDenEinkaufswagen(i, products[i].name, products[i].price);
        });
        button.innerHTML = `<b>${products[i].name}</b> <br> ${products[i].price} €`;
        suessigkeitenContainer.insertAdjacentElement("beforeend", button);
    }
};

const zeileEinfuegenTeilnehmer = () => {
    const tabelle = document.getElementById("tabelleTeilnehmer");
    // schreibe Tabellenzeile
    participants.forEach((el) => {
        if (!el.signature) {
            const reihe = tabelle.insertRow(-1);
            let vorname = el.firstname,
                zelle1 = reihe.insertCell();
            zelle1.innerHTML = vorname;

            let nachname = el.lastname,
                zelle2 = reihe.insertCell();
            zelle2.innerHTML = nachname;

            let gehalt = el.guthaben,
                zelle3 = reihe.insertCell();
            zelle3.innerHTML = `${gehalt} €`;

            reihe.setAttribute("rowId", rowIdTeilnehmer++);
            reihe.setAttribute("personId", el._id);
            reihe.setAttribute("guthaben", el.guthaben);
            reihe.setAttribute(
                "participantName",
                el.firstname + " " + el.lastname
            );

            reihe.addEventListener("click", function () {
                if (rowIdEinkauf > 1) {
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
                    clearEinkauf();
                    auswahl(
                        this.getAttribute("personId"),
                        this.getAttribute("guthaben"),
                        this.getAttribute("participantName")
                    );
                    currentId = this.getAttribute("personId");
                }
            });
        }
    });
};

function zeileEinfuegenEinkauf(artikelId, artikelName, preis) {
    const tabelle = document.getElementById("tabelleEinkauf");
    // schreibe Tabellenzeile
    const reihe = tabelle.insertRow(-1);
    let artikel = artikelName,
        zelle1 = reihe.insertCell();
    zelle1.innerHTML = artikel;

    let artikelPreis = `${preis} €`,
        zelle2 = reihe.insertCell();
    zelle2.innerHTML = artikelPreis;

    reihe.setAttribute("rowId", rowIdEinkauf++);
    reihe.setAttribute("artikelId", artikelId);
    reihe.setAttribute("preis", preis);

    reihe.addEventListener("click", function () {
        if (confirm("Artikel wirklich löschen?")) {
            ausDemEinkaufswagen(
                parseFloat(this.getAttribute("preis")),
                parseInt(this.closest("tr").rowIndex)
            );
        }
    });
}

const auswahl = (personId, guthaben, name) => {
    guthabenAlt = guthaben;
    guthabenNeu = guthabenAlt;
    document.getElementById("participantName").innerHTML = name;
    document.getElementById(
        "guthabenAlt"
    ).innerHTML = `Alt: <b>${guthabenAlt} € </b>`;
    document.getElementById(
        "guthabenNeu"
    ).innerHTML = `Neu: <b>${guthabenNeu} € </b>`;
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
    for (let i = rowIdEinkauf - 1; i > 0; i--) {
        tabelleEinkauf.deleteRow(i);
    }
    guthabenAlt = 0;
    guthabenNeu = 0;
    sum = 0;
    rowIdEinkauf = 1;
    currentId = 0;
    document.getElementById(
        "guthabenAlt"
    ).innerHTML = `Alt: <b>${guthabenAlt} €</b>`;
    document.getElementById(
        "guthabenNeu"
    ).innerHTML = `Neu: <b>${guthabenNeu} €</b>`;
    document.getElementById("sum").innerHTML = `Summe: <b>${sum} €</b>`;
};
const inDenEinkaufswagen = (artikelId, artikelName, preis) => {
    if (checkGuthaben(preis)) {
        sum += preis;
        sum = parseFloat(sum.toFixed(2));
        guthabenNeu -= preis;
        guthabenNeu = parseFloat(guthabenNeu.toFixed(2));

        document.getElementById(
            "guthabenNeu"
        ).innerHTML = `Neu: <b>${guthabenNeu} €</b>`;
        document.getElementById("sum").innerHTML = `Summe: <b>${sum} € </b>`;

        zeileEinfuegenEinkauf(artikelId, artikelName, preis);
    } else {
        alert("Nicht genug Guthaben");
    }
};

const ausDemEinkaufswagen = (preis, id) => {
    console.log(id);
    const tabelle = document.getElementById("tabelleEinkauf");
    tabelle.deleteRow(id);
    sum -= preis;
    sum = parseFloat(sum.toFixed(2));
    guthabenNeu += preis;
    guthabenNeu = parseFloat(guthabenNeu.toFixed(2));
    rowIdEinkauf--;

    document.getElementById(
        "guthabenNeu"
    ).innerHTML = `Neu: <b>${guthabenNeu} € </b>`;
    document.getElementById("sum").innerHTML = `Summe: <b>${sum} € </b>`;
};

const errorElement = (errorMessage) => {
    const element = document.createElement("div");
    element.setAttribute("class", "error");

    const text = document.createElement("p");
    text.setAttribute("class", "errorText");
    text.innerHTML = errorMessage;

    element.insertAdjacentElement("afterbegin", text);

    const container = document.getElementsByClassName("container")[0];
    container.insertAdjacentElement("afterbegin", element);
};

function toggleLightDark() {
    let elementsWhite = [];
    let elementsGray = [];
    let elementsText = [];
    elementsGray.push(
        document.getElementsByClassName("suessigkeitenContainer")[0]
    );

    elementsGray.push(document.getElementsByClassName("einkauf")[0]);
    elementsWhite.push(
        document.getElementsByClassName("buchhaltung-container")[0]
    );
    elementsWhite.push(document.getElementsByClassName("teilnehmer")[0]);
    elementsWhite.push(document.getElementsByClassName("settings")[0]);

    let buttons = document.getElementsByClassName("button");
    for (let i = 0; i < buttons.length; i++) {
        elementsText.push(buttons[i]);
    }

    let suessigkeiten = document.getElementsByClassName("suessigkeit");
    for (let i = 0; i < suessigkeiten.length; i++) {
        elementsText.push(suessigkeiten[i]);
    }
    let buchhaltungsElement = document.getElementsByClassName(
        "buchhaltungsElement"
    );
    for (let i = 0; i < buchhaltungsElement.length; i++) {
        elementsText.push(buchhaltungsElement[i]);
    }
    let tables = document.getElementsByTagName("table");
    for (let i = 0; i < tables.length; i++) {
        elementsText.push(tables[i]);
    }
    elementsText.push(document.getElementsByClassName("buchhaltung-name")[0]);
    elementsWhite.forEach((e) => {
        e.classList.toggle("lightModeWhite");
    });
    elementsGray.forEach((e) => {
        e.classList.toggle("lightModeGray");
    });
    elementsText.forEach((e) => {
        e.classList.toggle("lightModeText");
    });
}

getAllParticipants();
getAllProducts();