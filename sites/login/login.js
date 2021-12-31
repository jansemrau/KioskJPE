let isRegistration = false;

let x = window.matchMedia("(min-width: 62em)");
const changeView = () => {
    let registrationHeadline = document.getElementById("registrationHeadline");
    let registrationForm = document.getElementById("registrationForm");
    let loginHeadline = document.getElementById("loginHeadline");
    let loginForm = document.getElementById("loginForm");
    isRegistration = !isRegistration;
    console.log("geklickt");
    if (isRegistration) {
        loginHeadline.style.display = "none";
        loginForm.style.display = "none";
        registrationHeadline.style.display = "block";
        if (x.matches) {
            registrationForm.style.display = "block";
        } else {
            registrationForm.style.display = "flex";
        }
    } else {
        loginHeadline.style.display = "block";
        if (x.matches) {
            loginForm.style.display = "block";
        } else {
            loginForm.style.display = "flex";
        }
        registrationHeadline.style.display = "none";
        registrationForm.style.display = "none";
    }
};

const register = async () => {
    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;
    await fetch("http://localhost:8000/users/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password,
            passwordConfirm: passwordConfirm,
        }),
    });
    then((response) => {
        response.json().then((parsedJson) => {
            console.log(parsedJson);
            if (parsedJson.status !== "success") {
                errorElement(parsedJson.message);
            }
        });
    });
};

const login = async () => {
    const email = document.getElementById("emailLogin").value;
    const password = document.getElementById("passwordLogin").value;
    await fetch("http://localhost:8000/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    }).then((response) => {
        response.json().then((parsedJson) => {
            console.log(parsedJson);
            if (parsedJson.status !== "success") {
                errorElement(parsedJson.message);
            }
        });
    });
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
