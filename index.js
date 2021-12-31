document
    .getElementById("zeile")
    .addEventListener("click", zeileEinfuegenTeilnehmer);

let guthabenAlt = 0;
let guthabenNeu = guthabenAlt;
let sum = 0;
let rowId = 0;

function zeileEinfuegenTeilnehmer() {
    const tabelle = document.getElementById("tabelleTeilnehmer");
    // schreibe Tabellenzeile
    const reihe = tabelle.insertRow(-1);
    let vorname = "Jan",
        zelle1 = reihe.insertCell();
    zelle1.innerHTML = vorname;

    let nachname = "Semrau",
        zelle2 = reihe.insertCell();
    zelle2.innerHTML = nachname;

    let gehalt = 10,
        zelle3 = reihe.insertCell();
    zelle3.innerHTML = gehalt;

    reihe.setAttribute("personId", "1");
    reihe.setAttribute("guthaben", "100");

    reihe.addEventListener("click", function () {
        clear();
        auswahl(this.getAttribute("personId"), this.getAttribute("guthaben"));
    });
}

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

    reihe.setAttribute("rowId", rowId++);
    reihe.setAttribute("artikelId", artikelId);
    reihe.setAttribute("preis", preis);

    reihe.addEventListener("click", function () {
        if (confirm("Artikel wirklich löschen?")) {
            ausDemEinkaufswagen(parseFloat(this.getAttribute("preis")));
        }
    });
}

const auswahl = (personId, guthaben) => {
    guthabenAlt = guthaben;
    guthabenNeu = guthabenAlt;
    document.getElementById("guthabenAlt").innerHTML = `Alt: ${guthabenAlt} €`;
    document.getElementById("guthabenNeu").innerHTML = `Neu: ${guthabenNeu} €`;
};

const checkGuthaben = (preis) => {
    return guthabenNeu - preis >= 0 ? true : false;
};
const clear = () => {
    const tabelle = document.getElementById("tabelleEinkauf");
    for (let i = rowId; i > 0; i--) {
        tabelle.deleteRow(i);
    }
    guthabenAlt = 0;
    guthabenNeu = 0;
    sum = 0;
    rowId = 0;
    document.getElementById("guthabenAlt").innerHTML = `Alt: ${guthabenAlt} €`;
    document.getElementById("guthabenNeu").innerHTML = `Neu: ${guthabenNeu} €`;
    document.getElementById("sum").innerHTML = `Neu: ${sum} €`;
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
    tabelle.deleteRow(rowId - 1);
    sum -= preis;
    sum = parseFloat(sum.toFixed(2));
    guthabenNeu += preis;
    guthabenNeu = parseFloat(guthabenNeu.toFixed(2));

    document.getElementById("guthabenNeu").innerHTML = `Neu: ${guthabenNeu} €`;
    document.getElementById("sum").innerHTML = `Sum: ${sum} €`;
};
