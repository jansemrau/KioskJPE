let teilnehmer = [];

function printData() {
    var divToPrint = document.getElementById("printTable");
    newWin = window.open("");
    newWin.document.write("<html><body><div id='table'></div></body></html>");
    const table = newWin.document.getElementById("table");
    table.appendChild(divToPrint);
    setTimeout(function () {
        newWin.print();
    }, 500);
}

const createPrintableTable = () => {
    const tabelle = document.getElementById("printTable");
    // schreibe Tabellenzeile
    teilnehmer.forEach((el) => {
        const reihe = tabelle.insertRow(-1);
        reihe.style.border = "1px solid black";
        let vorname = el.firstname,
            zelle1 = reihe.insertCell();
        zelle1.style.border = "1px solid black";
        zelle1.innerHTML = vorname;

        let nachname = el.lastname,
            zelle2 = reihe.insertCell();
        zelle2.style.border = "1px solid black";
        zelle2.innerHTML = nachname;

        if (!el.signature) {
            let gehalt = el.guthaben,
                zelle3 = reihe.insertCell();
            zelle3.style.border = "1px solid black";
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
            zelle3.style.border = "1px solid black";
            zelle3.innerHTML = `${gehalt} € ausgezahlt am ${datum}`;
        }
        reihe.setAttribute("personId", el._id);
        //Aktion
        let image;
        if (el.signature) {
            image = document.createElement("img");
            image.src = el.signature;
        } else {
            image = document.createElement("div");
        }
        image.style.width = "14rem";
        image.style.height = "4rem";
        let zelle4 = reihe.insertCell();
        zelle4.style.border = "1px solid black";
        zelle4.appendChild(image);
    });
};

const druckeTeilnehmer = async () => {
    await fetch("http://89.22.122.138:8000/kiosk/getAllParticipants", {
        method: "Get",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {
        response.json().then((parsedJson) => {
            if (parsedJson.status !== "success") {
                errorElement(parsedJson.message);
            } else {
                teilnehmer = parsedJson.data.participants;
                createPrintableTable();
                printData();
            }
        });
    });
};
