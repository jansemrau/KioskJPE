let ausgeklappt = false;

const submitForm = async () => {
    let newFilename = "";
    const name = document.getElementById("datetime");
    const files = document.getElementById("files");
    const formData = new FormData();
    formData.append("name", name.value);
    for (let i = 0; i < files.files.length; i++) {
        formData.append("files", files.files[i]);
    }
    await fetch("http://localhost:8000/gottesdienste/upload", {
        method: "POST",
        body: formData,
    })
        .then((res) => {
            return res.json();
        })
        .then(function (data) {
            console.log(data);
            newFilename = data.data.filename;
        })
        .catch((err) => ("Error occured", err));

    await fetch("http://localhost:8000/gottesdienste/newGottesdienst", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            datetime: name.value,
            filename: newFilename,
        }),
    })
        .then((res) => console.log(res))
        .catch((err) => ("Error occured", err));
    refresh();
};

const refresh = async () => {
    let container = document.getElementById("gottesdienstecontainer");
    container.remove();
    await getAllGottesdienste();
};

const getAllGottesdienste = async () => {
    await fetch("http://localhost:8000/gottesdienste/getAllGottesdienste")
        .then(function (response) {
            // The response is a Response instance.
            // You parse the data into a useable format using `.json()`
            return response.json();
        })
        .then(function (data) {
            // `data` is the parsed version of the JSON returned from the above endpoint.
            makeElements(data.data.Gottesdienste);
        });
};
getAllGottesdienste();

const deleteGottesdienst = async (id) => {
    await fetch(
        `http://localhost:8000/gottesdienste/deleteGottesdienst/${id}`,
        {
            method: "DELETE",
        }
    ).then(function (response) {
        return response;
    });
    refresh();
};

const changeState = (id) => {
    let ablauf = document.querySelector(`#ablauf${id}`);
    ausgeklappt = !ausgeklappt;
    if (ausgeklappt) {
        ablauf.style.display = "initial";
    } else {
        ablauf.style.display = "none";
    }
};

const makeElements = (data) => {
    let gottesdienstecontainer = document.createElement("div");
    gottesdienstecontainer.setAttribute("id", "gottesdienstecontainer");
    gottesdienstecontainer.setAttribute("class", "gottesdienste");

    let gottesdiensteHinzufuegen = document.getElementById(
        "gottesdienst-hinzufuegen"
    );
    gottesdiensteHinzufuegen.insertAdjacentElement(
        "afterend",
        gottesdienstecontainer
    );
    for (let i = 0; i < data.length; i++) {
        let container = document.createElement("div");
        container.setAttribute("class", "gottesdienst");
        container.setAttribute("value", data[i]._id);

        const innerContainer = document.createElement("div");
        innerContainer.setAttribute("class", "innerContainer");
        innerContainer.addEventListener("click", function () {
            changeState(i);
        });

        const datum = document.createElement("p");
        datum.setAttribute("class", "datum");
        datum.innerHTML = createDate(data[i].datetime);

        const icon = document.createElement("img");
        icon.setAttribute("src", "../../images/icon-entfernen.png");
        icon.setAttribute("class", "icon");
        icon.addEventListener("click", function () {
            deleteGottesdienst(data[i]._id);
        });

        innerContainer.insertAdjacentElement("beforeend", datum);
        innerContainer.insertAdjacentElement("beforeend", icon);

        const ablauf = document.createElement("embed");
        ablauf.setAttribute("class", "ablauf");
        ablauf.setAttribute("id", `ablauf${i}`);
        ablauf.setAttribute(
            "src",
            `../../backend/uploads/${data[i].filename}#toolbar=0&navpanes=0&scrollbar=0`
        );
        container.insertAdjacentElement("beforeend", innerContainer);
        container.insertAdjacentElement("beforeend", ablauf);
        gottesdienstecontainer.insertAdjacentElement("beforeend", container);
    }
};

const newGottesdienst = async (event) => {
    try {
        submitForm();
    } catch (e) {
        console.log(e);
    }
};

function createDate(date) {
    date = new Date(date);
    return (
        ("0" + date.getDate()).slice(-2) +
        "." +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        "." +
        date.getFullYear() +
        "," +
        ("0" + date.getHours()).slice(-2) +
        ":" +
        ("0" + date.getMinutes()).slice(-2)
    );
}
