




async function sendResetEmail(email, uuid) {

    const resetLink = `http://localhost:4500/expense/resetpassword/${uuid}`;

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "accept": "application/json",
            "content-type": "application/json",
            "api-key": process.env.BREVO_API_KEY
        },
        body: JSON.stringify({
            sender: {
                name: "Expense Tracker",
                email: process.env.SENDER_EMAIL
            },

            to: [
                {
                    email: email
                }
            ],

            subject: "Reset Your Password",

            htmlContent: `
                <h2>Expense Tracker</h2>

                <p>Click below to reset your password.</p>

                <a href="${resetLink}">
                    Reset Password
                </a>

                <p>This link expires after use.</p>
            `
        })
    });

    const data = await response.json();

    console.log(response.status);
    console.log(data);

    if (!response.ok) {
        throw new Error(data.message);
    }
}

module.exports = { sendResetEmail };