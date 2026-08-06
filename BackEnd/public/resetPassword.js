console.log("Reset Password Page Loaded");


const uuid = window.location.pathname.split("/").pop();

document.getElementById("uuid").value = uuid;

document
    .getElementById("resetForm")
    .addEventListener("submit", updatePassword);

async function updatePassword(event) {

    event.preventDefault();

    const password = document.getElementById("password").value;

    const uuid = document.getElementById("uuid").value;

    const response = await fetch(
        `http://localhost:4500/expense/updatepassword/${uuid}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password
            })
        }
    );

    const data = await response.json();

    alert(data.message);
    window.location.href="/Login/login.html"

}