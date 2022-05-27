let productsTable = [];
let rowIdProducts = 0;
let sum = 0;
let rowIdParticipants = 0;
let participants = [];
let products = [];

let path = "https://www.jan-semrau.de";

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}
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

const newParticipant = async () => {
    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    let credit = document.getElementById("credit").value;
    let isValid = /^[0-9,.]*$/.test(credit);
    if (!isNaN(isValid)) {
        if (credit.indexOf(",") > -1) {
            credit = credit.replace(",", ".");
            credit = parseFloat(credit);
        } else {
            credit = parseFloat(credit);
        }
        await fetch(`${path}/graphql`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                query: `mutation createParticipant($firstname: String, $lastname: String, $credit: Float){
    createParticipant(firstname: $firstname, lastname: $lastname credit: $credit)
}`,
                variables: {
                    firstname: firstname,
                    lastname: lastname,
                    credit: credit,
                },
            }),
        }).then((response) => {
            response.json().then((parsedJson) => {
                location.reload();
            });
        });
    } else {
        alert("Kein gültiges Guthaben eingegeben, bitte neu eingeben");
        location.reload();
    }
};

const deleteParticipant = async (id) => {
    await fetch(`${path}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            query: `mutation deleteParticipant($id: ID){
    deleteParticipant(id: $id)
}
`,
            variables: {
                id: id,
            },
        }),
    }).then((response) => {
        location.reload();
    });
};

const payOut = async (currentId, dataUrl) => {
    let date = Date.now();
    await fetch(`${path}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            query: `mutation updateSignature($id: ID, $signature: String, $datePayment: Float){
    updateSignature(id: $id, signature: $signature, datePayment: $datePayment)
}`,
            variables: {
                id: currentId,
                signature: dataUrl,
                datePayment: date,
            },
        }),
    }).then((response) => {
        response.json().then((parsedJson) => {
            location.reload();
        });
    });
};

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

const lineInsertParticipant = () => {
    const table = document.getElementById("tableParticipants");
    // schreibe Tabellenzeile
    participants.forEach((el) => {
        const row = table.insertRow(-1);
        let firstname = el.firstname,
            cell1 = row.insertCell();
        cell1.innerHTML = firstname;

        let lastname = el.lastname,
            cell2 = row.insertCell();
        cell2.innerHTML = lastname;

        if (!el.signature) {
            let credit = el.credit,
                cell3 = row.insertCell();
            cell3.innerHTML = `${credit} €`;
        } else {
            let dateOld = new Date(el.datePayment);
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
            cell3.innerHTML = `${credit} € ausgezahlt am ${date}`;
        }
        row.setAttribute("personId", el._id);
        //Aktion
        let deleteButton = document.createElement("button");
        deleteButton.setAttribute("class", "button button--fullwidth");
        deleteButton.innerHTML = "Löschen";
        deleteButton.addEventListener("click", function () {
            let result = confirm(
                `Bist du dir sicher, dass du ${el.firstname} ${el.lastname} unwiderruflich löschen möchtest?`
            );
            result && deleteParticipant(el._id);
        });

        let payOutButton = document.createElement("button");
        if (el.signature) {
            payOutButton.setAttribute(
                "class",
                "button button--ausgezahlt button--fullwidth"
            );
            payOutButton.innerHTML = "Ausgezahlt";
            payOutButton.addEventListener("click", function () {
                modal.className = "Modal is-visuallyHidden";
                container.className = "container is-blurred";
                modal.className = "Modal";

                container.parentElement.className = "ModalOpen";
                var image = new Image();
                image.src = el.signature;
                let canvasContainer = document.getElementById("modal-canvas");
                canvasContainer.style.display = "none";
                let imageContainer = document.getElementById(
                    "modal-image-container"
                );
                imageContainer.style.display = "block";
                let images = document.getElementById("modal-image");
                images.style.display = "block";
                images.appendChild(image);

                let closeButton = document.getElementById(
                    "sig-cancellationBtnImage"
                );

                // Close the modal
                closeButton.onclick = function () {
                    modal.className = "Modal is-hidden is-visuallyHidden";
                    container.className = "container";
                    container.parentElement.className = "";
                    let modalImageContainer =
                        document.getElementById("modal-image");
                    modalImageContainer.removeChild(
                        modalImageContainer.lastChild
                    );
                    location.reload();
                };
            });
        } else {
            payOutButton.setAttribute("class", "button button--fullwidth");
            payOutButton.innerHTML = "Auszahlen";
            payOutButton.addEventListener("click", function () {
                if (
                    confirm(
                        "Bist du dir sicher, dass du den Betrag auszahlen möchtest?"
                    )
                ) {
                    modal.className = "Modal is-visuallyHidden";
                    container.className = "container is-blurred";
                    modal.className = "Modal";
                    container.parentElement.className = "ModalOpen";
                    signature(el._id);
                }
            });
        }

        let purchasesButton = document.createElement("button");
        purchasesButton.setAttribute("class", "button button--fullwidth");
        purchasesButton.innerHTML = "Einkäufe";
        purchasesButton.addEventListener("click", function () {
            printPurchases(el._id);
        });

        let cell4 = row.insertCell();
        cell4.appendChild(deleteButton);
        cell4.appendChild(payOutButton);
        cell4.appendChild(purchasesButton);

        row.setAttribute("rowId", rowIdParticipants++);
        row.setAttribute("personId", el._id);
        row.setAttribute("credit", el.credit);
        row.setAttribute("participantName", el.firstname + " " + el.lastname);
    });
};

const getAllProductsTable = async () => {
    await fetch(`${path}/graphql`, {
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
                productsTable = parsedJson.data.getAllProducts;
                createProductsTable();
            });
        })
        .catch((error) => {
            //Here is still promise
            console.log(error);
            errorElement(error);
        });
};

function createProductsTable() {
    const table = document.getElementById("tabelleProdukte");
    // schreibe Tabellenzeile
    productsTable.forEach((el) => {
        const row = table.insertRow(-1);
        let name = el.name,
            cell1 = row.insertCell();
        cell1.innerHTML = name;

        let price = el.price,
            cell2 = row.insertCell();
        cell2.innerHTML = `${price} €`;

        let deleteButton = document.createElement("button");
        deleteButton.setAttribute("class", "button button--fullwidth");
        deleteButton.innerHTML = "Löschen";
        deleteButton.addEventListener("click", function () {
            if (
                confirm(
                    "Bist du dir sicher, dass du dieses Produkt löschen möchtest?"
                )
            ) {
                deleteProduct(el._id);
            }
        });

        let cell3 = row.insertCell();
        cell3.appendChild(deleteButton);

        row.setAttribute("rowId", rowIdProducts++);
        row.setAttribute("ProductId", el._id);
    });
}

const newProduct = async (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    let price = document.getElementById("price").value;
    let isValid = /^[0-9,.]*$/.test(price);
    if (!isNaN(isValid)) {
        if (price.indexOf(",") > -1) {
            price = price.replace(",", ".");
            price = parseFloat(price);
        } else {
            price = parseFloat(price);
        }
        await fetch(`${path}/graphql`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                query: `mutation createProduct($name: String, $price: Float){
    createProduct(name: $name, price: $price)
}`,
                variables: {
                    name: name,
                    price: price,
                },
            }),
        }).then((response) => {
            location.reload();
        });
    } else {
        alert("Keinen gültigen Preis eingegeben, bitte neu eingeben");
        location.reload();
    }
};

const deleteProduct = async (id) => {
    await fetch(`${path}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            query: `mutation deleteProduct($id: ID){
    deleteProduct(id: $id)
}`,
            variables: {
                id: id,
            },
        }),
    }).then((response) => {
        location.reload();
    });
};

const signOut = () => {
    window.localStorage.removeItem("authToken");
    window.location.reload();
};

getAllParticipants();
getAllProductsTable();
