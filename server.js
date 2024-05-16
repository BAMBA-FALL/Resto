const express = require("express");
const connectDB = require("./config/db")
const dotenv = require("dotenv").config();
const app = express(); 

const port = 4000; 

//connexion avec la db
connectDB();
// app.get("/api", function(req,res){
//     res.json({message: "Voici le message "});
// });

//ici on place les middleware qui permet de traiter les données des request 

app.use(express.json()); 
app.use(express.urlencoded({ extended: false}));

app.use("/api", require("./router/routes"))

app.listen(port, ()=>console.log(`Le serveur a démarré au port ${port} `));
