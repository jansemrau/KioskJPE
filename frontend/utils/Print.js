let teilnehmer = [];

const createPrintableTable = () => {
    let newWin = window.open("");
    newWin.document.write(`<html><body><div id='table'><table
            style="border: 1px solid black; font-family: Arial, Helvetica, sans-serif; font-size: 1rem; border-collapse:collapse;"
            id="printTable"
            class="printTable"
        >
            <thead>
                <tr>
                    <th>Vorname</th>
                    <th>Nachname</th>
                    <th>Guthaben</th>
                    <th>Unterschrift</th>
                </tr>
            </thead>
            <tbody id="printTableBody"></tbody>
        </table></div></body></html>`);
    const tabelle = newWin.document.getElementById("printTable");
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
    setTimeout(function () {
        newWin.print();
    }, 500);
};

const druckeTeilnehmer = async () => {
    console.log("Ja");
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
    }).then((response) => {
        response.json().then((parsedJson) => {
            teilnehmer = parsedJson.data.getAllParticipants;
            createPrintableTable();
        });
    });
};
