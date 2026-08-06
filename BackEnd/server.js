const express = require("express");
const userDB = require("./utils/db");
const cors = require("cors");
const routes = require("./routes/expenseRoutes");
const PORT = 4500;
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");
const path = require("path");
const app = express();
dotenv.config();
app.use(express.static(path.join(__dirname, "public")));

require("./models");
console.log("Gemini:", process.env.GEMINI_API_KEY);
console.log("Brevo :", process.env.BREVO_API_KEY);
console.log("Sender :", process.env.SENDER_EMAIL);

// app.get("/", (req, res) => {
//   res.send("Hey it is working good");
// });
app.use(cors());
app.use(express.json());

app.use("/expense", routes);

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

app.post("/expense/ask", async (req, res) => {
  console.log("========== AI ROUTE HIT ==========");
  console.log(req.body);
  const { prompt } = req.body;
  try {
    console.log("Creating Gemini client...");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    console.log("Calling Gemini...");

    const responsefromAI = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      //  contents: "Say Hello"
      contents: `
          You are an expense category classifier.

            Categories are:

            Fuel
            Food
            Groceries
            Electricity
            Movie
            Holiday Trips
            FootWear
            Other

          Only return ONE category.

         Description:
         ${prompt}
         `,
    });
    console.log("Gemini replied:");

    console.log(responsefromAI.text);
    res.status(200).json({ response: responsefromAI.text });
  } catch (err) {
    console.log("ERROR OCCURRED");
    console.log("Status:", err.status);
    console.log("Message:", err.message);
    console.log("Full Error:", err);

    res.status(200).json({ response: "Something went wrong" });
  }
});

userDB
  .sync({ force: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is running Good");
    });
  })
  .catch((err) => {
    console.log({ err: err.message });
  });
