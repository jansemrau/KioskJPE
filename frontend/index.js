let guthabenAlt = 0;
let guthabenNeu = guthabenAlt;
let sum = 0;
let rowIdTeilnehmer = 0;
let rowIdEinkauf = 1;
let participants = [];
let products = [];
let currentId = 0;
let purchases = [];

let path = "http://localhost:8000";

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

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

const getAllParticipants = async () => {
    await fetch(`${path}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            query: `{ getAllParticipants{
                        _id
                        firstname
                        lastname
                        guthaben
                        datumAuszahlung
                        signature
                    }
                }`,
        }),
    })
        .then(handleErrors)
        .then((response) => {
            response.json().then((parsedJson) => {
                participants = parsedJson.data.getAllParticipants;
                zeileEinfuegenTeilnehmer();
            });
        })
        .catch((error) => {
            //Here is still promise
            console.log(error);
            errorElement(error);
        });
};

const speichern = async () => {
    await fetch(`${path}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            query: `mutation updateGuthaben($id: ID, $guthaben: Float){
    updateGuthaben(id: $id, guthaben: $guthaben)
}`,
            variables: {
                id: currentId,
                guthaben: guthabenNeu,
            },
        }),
    })
        .then(handleErrors)

        .catch((error) => {
            //Here is still promise
            console.log(error);
            errorElement(error);
        });
    await fetch(`${path}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            query: `mutation insertPurchases($entries: [InputPurchase]){
    insertPurchases(entries: $entries)
}`,
            variables: {
                entries: purchases,
            },
        }),
    }).then((response) => {
        response.json().then((parsedJson) => {
            clear();
            getAllParticipants();
        });
    });
};

const getAllProducts = async () => {
    fetch(`${path}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            query: `{ getAllProducts{
                        _id
                        name
                        price
                    }
                }`,
        }),
    })
        .then(handleErrors)
        .then((response) => {
            response.json().then((parsedJson) => {
                products = parsedJson.data.getAllProducts;
                createProducts();
                toggleLightDark();
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
            inDenEinkaufswagen(
                products[i]._id,
                products[i].name,
                products[i].price
            );
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
    purchases = [];
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

        if (purchases.length > 0) {
            let foundEntry = false;
            for (let i = 0; i < purchases.length; i++) {
                if (purchases[i].productID == artikelId) {
                    purchases[i].count = purchases[i].count + 1;
                    foundEntry = true;
                    break;
                }
            }
            if (!foundEntry) {
                purchases.push({
                    productID: artikelId,
                    userID: currentId,
                    count: 1,
                    date: Date.now(),
                });
            }
        } else {
            purchases.push({
                productID: artikelId,
                userID: currentId,
                count: 1,
                date: Date.now(),
            });
        }
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

    const index = purchases.indexOf(id);
    if (index > -1) {
        purchases.splice(index, 1);
    }

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
