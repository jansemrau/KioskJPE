const login = async () => {
    let email = document.getElementById("inputEmail").value;
    let password = document.getElementById("inputPassword").value;
    console.log(email);
    await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    })
        .then((response) => {
            if (response.status === 400) {
                document.getElementById("errorContainer").style.display =
                    "inherit";
                document.getElementById("errorField").innerHTML = e.value;
            } else if (response.status === 200) {
                response.json().then((parsedJson) => {
                    try {
                        console.log(parsedJson);
                        localStorage.setItem(
                            "authToken",
                            parsedJson.data.user.token
                        );
                        window.location.href = "index.html";
                    } catch (e) {
                        window.location.reload();
                    }
                });
            } else {
                document.getElementById("errorContainer").style.display =
                    "inherit";
                document.getElementById("errorField").innerHTML = e.value;
            }
        })
        .catch((e) => {
            document.getElementById("errorContainer").style.display = "inherit";
            document.getElementById("errorField").innerHTML = "Fehler";
        });
};
