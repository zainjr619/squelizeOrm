const express = require("express");
const cors = require('cors');
const dotenv = require("dotenv");
const path = require("path");

const app = express();

// app.use(express.json());
// app.use(cors());



dotenv.config({ path: path.join(__dirname, ".env") });

require("./src/startup/routes")(app);

const db = require("./src/models");
db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });


app.get("/",(req,res)=>{
   return res.status(200).send("Welcome to WebApis.");
})

const port = process.env.PORT || 3500;
app.listen(port, () => {
  console.log(`Secure Server listning on port ${port}`);
});
