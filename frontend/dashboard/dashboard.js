let purchases = [];

const createPurchasePrintableTable = () => {
    let newWin = window.open("");
    newWin.document.write(`<html><body><div id='table'> <table
        style="border: 1px solid black; font-family: Arial, Helvetica, sans-serif; font-size: 1rem; border-collapse:collapse;"
        id="printTablePurchases" class="printTablePurchases">
        <thead>
            <tr>
                <th>Vorname</th>
                <th>Nachname</th>
                <th>Anzahl</th>
                <th>Produkt</th>
                <th>Gekauft am</th>
            </tr>
        </thead>
        <tbody id="printTableBodyPurchases">
        </tbody>
    </table></div></body></html>`);
    const tabelle = newWin.document.getElementById("printTablePurchases");
    purchases.forEach((el) => {
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

        let anzahl = el.count,
            zelle3 = reihe.insertCell();
        zelle3.style.border = "1px solid black";
        zelle3.innerHTML = `${anzahl}x`;

        let productName = el.productname,
            zelle4 = reihe.insertCell();
        zelle4.style.border = "1px solid black";
        zelle4.innerHTML = `${productName}`;

        let datumAlt = new Date(el.date);
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
            zelle5 = reihe.insertCell();
        zelle5.style.border = "1px solid black";
        zelle5.innerHTML = `Gekauft am ${datum}`;

        reihe.setAttribute("personId", el._id);
    });
};

const druckePurchases = async (userId) => {
    console.log("Ja");
    await fetch(`${path}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            query: `{getAllPurchases(userID: "${userId}"){
                        firstname
                        lastname
                        productname
                        count
                        date
}}`,
        }),
    }).then((response) => {
        response.json().then((parsedJson) => {
            purchases = parsedJson.data.getAllPurchases;
            createPurchasePrintableTable();
            purchases = [];
        });
    });
};
