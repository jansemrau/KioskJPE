let participants = [];

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
    participants.forEach((el) => {
        const row = tabelle.insertRow(-1);
        row.style.border = "1px solid black";
        let firstname = el.firstname,
            cell1 = row.insertCell();
        cell1.style.border = "1px solid black";
        cell1.innerHTML = firstname;

        let lastname = el.lastname,
            cell2 = row.insertCell();
        cell2.style.border = "1px solid black";
        cell2.innerHTML = lastname;

        if (!el.signature) {
            let credit = el.credit,
                cell3 = row.insertCell();
            cell3.style.border = "1px solid black";
            cell3.innerHTML = `${credit} €`;
        } else {
            let dateOld = new Date(el.datePayOut);
            let date =
                ("0" + dateOld.getDate()).slice(-2) +
                "." +
                ("0" + (dateOld.getMonth() + 1)).slice(-2) +
                "." +
                dateOld.getFullYear() +
                ", " +
                ("0" + dateOld.getHours()).slice(-2) +
                ":" +
                ("0" + dateOld.getMinutes()).slice(-2) +
                " Uhr";
            let credit = el.credit,
                cell3 = row.insertCell();
            cell3.style.border = "1px solid black";
            cell3.innerHTML = `${credit} € ausgezahlt am ${date}`;
        }
        row.setAttribute("personId", el._id);
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
        let cell4 = row.insertCell();
        cell4.style.border = "1px solid black";
        cell4.appendChild(image);
    });
    setTimeout(function () {
        newWin.print();
    }, 500);
};

const printParticipants = async () => {
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
                        credit
                        datePayOut
                        signature
                    }
                }`,
        }),
    }).then((response) => {
        response.json().then((parsedJson) => {
            participants = parsedJson.data.getAllParticipants;
            createPrintableTable();
        });
    });
};
