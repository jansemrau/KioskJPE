let creditOld = 0;
let creditNew = creditOld;
let sum = 0;
let rowIdParticipants = 0;
let rowIdPurchase = 1;
let participants = [];
let products = [];
let currentId = 0;
let purchases = [];

let path = "https://www.jan-semrau.de";

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
                        credit
                        datePayment
                        signature
                    }
                }`,
        }),
    })
        .then(handleErrors)
        .then((response) => {
            response.json().then((parsedJson) => {
                participants = parsedJson.data.getAllParticipants;
                lineInsertParticipant();
            });
        })
        .catch((error) => {
            //Here is still promise
            console.log(error);
            errorElement(error);
        });
};

const save = async () => {
    await fetch(`${path}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            query: `mutation updateCredit($id: ID, $credit: Float){
    updateCredit(id: $id, credit: $credit)
}`,
            variables: {
                id: currentId,
                credit: creditNew,
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
    const sweetsContainer = document.getElementById("sweetsContainer");
    for (let i = 0; i < products.length; i++) {
        const button = document.createElement("button");
        button.setAttribute("class", "sweets");
        button.addEventListener("click", function () {
            intoTheShoppingCart(
                products[i]._id,
                products[i].name,
                products[i].price
            );
        });
        button.innerHTML = `<b>${products[i].name}</b> <br> ${products[i].price} €`;
        sweetsContainer.insertAdjacentElement("beforeend", button);
    }
};

const lineInsertParticipant = () => {
    const table = document.getElementById("tableParticipants");
    // schreibe tablenzeile
    participants.forEach((el) => {
        if (!el.signature) {
            const row = table.insertRow(-1);
            let firstname = el.firstname,
                cell1 = row.insertCell();
            cell1.innerHTML = firstname;

            let lastname = el.lastname,
                cell2 = row.insertCell();
            cell2.innerHTML = lastname;

            let credit = el.credit,
                cell3 = row.insertCell();
            cell3.innerHTML = `${credit} €`;

            row.setAttribute("rowId", rowIdParticipants++);
            row.setAttribute("personId", el._id);
            row.setAttribute("credit", el.credit);
            row.setAttribute(
                "participantName",
                el.firstname + " " + el.lastname
            );

            row.addEventListener("click", function () {
                if (rowIdPurchase > 1) {
                    if (
                        confirm(
                            "Bist du dir sicher? Du hast noch nicht gespeichert!"
                        )
                    ) {
                        clearShopping();
                        selection(
                            this.getAttribute("personId"),
                            this.getAttribute("credit"),
                            this.getAttribute("participantName")
                        );
                        currentId = this.getAttribute("personId");
                    }
                } else {
                    clearShopping();
                    selection(
                        this.getAttribute("personId"),
                        this.getAttribute("credit"),
                        this.getAttribute("participantName")
                    );
                    currentId = this.getAttribute("personId");
                }
            });
        }
    });
};

function lineInfoPurchase(articleId, articleName, price) {
    const table = document.getElementById("tablePurchase");
    // schreibe tablenzeile
    const row = table.insertRow(-1);
    let article = articleName,
        cell1 = row.insertCell();
    cell1.innerHTML = article;

    let articlePrice = `${price} €`,
        cell2 = row.insertCell();
    cell2.innerHTML = articlePrice;

    row.setAttribute("rowId", rowIdPurchase++);
    row.setAttribute("articleId", articleId);
    row.setAttribute("price", price);

    row.addEventListener("click", function () {
        if (confirm("Artikel wirklich löschen?")) {
            outOftheShoppingCart(
                parseFloat(this.getAttribute("price")),
                parseInt(this.closest("tr").rowIndex),
                articleId
            );
        }
    });
}

const selection = (personId, credit, name) => {
    creditOld = credit;
    creditNew = creditOld;
    document.getElementById("participantName").innerHTML = name;
    document.getElementById(
        "creditOld"
    ).innerHTML = `Alt: <b>${creditOld} € </b>`;
    document.getElementById(
        "creditNew"
    ).innerHTML = `Neu: <b>${creditNew} € </b>`;
};

const checkCredit = (price) => {
    return creditNew - price >= 0 ? true : false;
};
const clear = () => {
    clearShopping();
    const tableParticipants = document.getElementById("tableParticipants");
    for (let i = rowIdParticipants; i > 0; i--) {
        tableParticipants.deleteRow(i);
    }
    rowIdParticipants = 0;
    document.getElementById("participantName").innerHTML = name;
};
const clearShopping = () => {
    const tablePurchase = document.getElementById("tablePurchase");
    for (let i = rowIdPurchase - 1; i > 0; i--) {
        tablePurchase.deleteRow(i);
    }
    creditOld = 0;
    creditNew = 0;
    sum = 0;
    rowIdPurchase = 1;
    currentId = 0;
    purchases = [];
    document.getElementById(
        "creditOld"
    ).innerHTML = `Alt: <b>${creditOld} €</b>`;
    document.getElementById(
        "creditNew"
    ).innerHTML = `Neu: <b>${creditNew} €</b>`;
    document.getElementById("sum").innerHTML = `Summe: <b>${sum} €</b>`;
};

const intoTheShoppingCart = (articleId, articleName, price) => {
    if (checkCredit(price)) {
        sum += price;
        sum = parseFloat(sum.toFixed(2));
        creditNew -= price;
        creditNew = parseFloat(creditNew.toFixed(2));

        document.getElementById(
            "creditNew"
        ).innerHTML = `Neu: <b>${creditNew} €</b>`;
        document.getElementById("sum").innerHTML = `Summe: <b>${sum} € </b>`;

        if (purchases.length > 0) {
            let foundEntry = false;
            for (let i = 0; i < purchases.length; i++) {
                if (purchases[i].productID == articleId) {
                    purchases[i].count = purchases[i].count + 1;
                    foundEntry = true;
                    break;
                }
            }
            if (!foundEntry) {
                purchases.push({
                    productID: articleId,
                    userID: currentId,
                    count: 1,
                    date: Date.now(),
                });
            }
        } else {
            purchases.push({
                productID: articleId,
                userID: currentId,
                count: 1,
                date: Date.now(),
            });
        }
        lineInfoPurchase(articleId, articleName, price);
    } else {
        alert("Nicht genug Guthaben");
    }
};

const outOftheShoppingCart = (price, id, articleID) => {
    console.log(id);
    const table = document.getElementById("tablePurchase");
    table.deleteRow(id);
    sum -= price;
    sum = parseFloat(sum.toFixed(2));
    creditNew += price;
    creditNew = parseFloat(creditNew.toFixed(2));
    rowIdPurchase--;

    const purchaseIndex = purchases.findIndex((e) => e.productID == articleID);
    if (purchaseIndex > -1) {
        if (purchases[purchaseIndex].count > 1) {
            purchases[purchaseIndex].count--;
        } else {
            purchases.splice(purchaseIndex, 1);
        }
    }

    document.getElementById(
        "creditNew"
    ).innerHTML = `Neu: <b>${creditNew} € </b>`;
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
    elementsGray.push(document.getElementsByClassName("sweetsContainer")[0]);

    elementsGray.push(document.getElementsByClassName("purchase")[0]);
    elementsWhite.push(
        document.getElementsByClassName("accounting-container")[0]
    );
    elementsWhite.push(document.getElementsByClassName("participants")[0]);
    elementsWhite.push(document.getElementsByClassName("settings")[0]);

    let buttons = document.getElementsByClassName("button");
    for (let i = 0; i < buttons.length; i++) {
        elementsText.push(buttons[i]);
    }

    let sweets = document.getElementsByClassName("sweets");
    for (let i = 0; i < sweets.length; i++) {
        elementsText.push(sweets[i]);
    }
    let accountingElement =
        document.getElementsByClassName("accountingElement");
    for (let i = 0; i < accountingElement.length; i++) {
        elementsText.push(accountingElement[i]);
    }
    let tables = document.getElementsByTagName("table");
    for (let i = 0; i < tables.length; i++) {
        elementsText.push(tables[i]);
    }
    elementsText.push(document.getElementsByClassName("accounting-name")[0]);
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
