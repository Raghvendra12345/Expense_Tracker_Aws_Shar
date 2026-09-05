const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
// const helmet=require("helmet")
const compression=require("compression")
const userDB = require("./utils/db");
const cors = require("cors");
const routes = require("./routes/expenseRoutes");
const PORT = process.env.PORT || 4500;

const { GoogleGenAI } = require("@google/genai");
const path = require("path");
const app = express();


//Server static file is required
app.use(express.static(path.join(__dirname, "public")));

require("./models");
// console.log("Gemini:", process.env.GEMINI_API_KEY);
// console.log("Brevo :", process.env.BREVO_API_KEY);
// console.log("Sender :", process.env.SENDER_EMAIL);


const allowedOrigins=[
  "http://127.0.0.1:5500",
  "http://localhost:5500"
]

//Security/Middleware
app.use(cors(
  {
    origin:allowedOrigins,
    methods: ["GET","POST","PUT","DELETE"],
    credentials:true  
  }
));

// app.use(helmet())
app.use(express.json({limit:"10kb"}));
app.use(compression())

app.use("/expense", routes);

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });


//AI ROUTE
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
    
    console.log("AI Error:", err);
     console.error("Message:", err.message);
    console.error("Full error:", err);
    res.status(500).json({ response: "Something went wrong" });
  }
});

//Global Error Handler
app.use((err,req,res,next)=>{
  console.error(err)
  res.status(500).json({
    success:false,
     message:"Internal Server Error"
  })
})



  async function startServer(){
    try{
      await userDB.authenticate()
      console.log("Connected Successfully")

      await userDB.sync({force:false})
      console.log("Database Synchronized Successfully")
      app.listen(PORT,()=>{
        console.log("Server is running Good")
      })

    }
    catch(error){
      console.error("Unable to start Server",error)
      process.exit(1)

    }
  }
  startServer()