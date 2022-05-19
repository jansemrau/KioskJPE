let path = "https://www.jan-semrau.de";

const login = async () => {
    let email = document.getElementById("inputEmail").value;
    let password = document.getElementById("inputPassword").value;
    await fetch(`${path}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    }).then((response) => {
        if (response.status === 400) {
            document.getElementById("errorContainer").style.display = "inherit";
            document.getElementById("errorField").innerHTML = e.value;
        } else if (response.status === 200) {
            response.json().then((parsedJson) => {
                if (parsedJson.status !== "success") {
                    errorElement(parsedJson.message);
                } else {
                    localStorage.setItem(
                        "authToken",
                        parsedJson.data.user.token
                    );
                    location.href = `${path}/verkauf`;
                }
            });
        }
    });
};
