let purchases = [];

const createPurchasePrintableTable = (newWin) => {
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
    const table = newWin.document.getElementById("printTablePurchases");
    purchases.forEach((el) => {
        const row = table.insertRow(-1);
        row.style.border = "1px solid black";
        let firstname = el.firstname,
            cell1 = row.insertCell();
        cell1.style.border = "1px solid black";
        cell1.innerHTML = firstname;

        let lastname = el.lastname,
            cell2 = row.insertCell();
        cell2.style.border = "1px solid black";
        cell2.innerHTML = lastname;

        let count = el.count,
            cell3 = row.insertCell();
        cell3.style.border = "1px solid black";
        cell3.innerHTML = `${count}x`;

        let productName = el.productname,
            cell4 = row.insertCell();
        cell4.style.border = "1px solid black";
        cell4.innerHTML = `${productName}`;

        let dateOld = new Date(el.date);
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
        //TODO: What is Gehalt doing

        let cell5 = row.insertCell();
        cell5.style.border = "1px solid black";
        cell5.innerHTML = `Gekauft am ${date}`;

        row.setAttribute("personId", el._id);
    });
};

const printPurchases = async (userId) => {
    let newWin = window.open("");
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
            createPurchasePrintableTable(newWin);
            purchases = [];
        });
    });
};
