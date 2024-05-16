// on plusieurs méthode pour se connecter à la base de donnée Mongo 

// La première méthode
// const mongoose = require('mongoose') ;

// mongoose.connect(process.env.URI, 
//  { useNewUrlParser : true,
//  useUnifiedTopology : true })
// .then((data) => {
//  console.log(`Base de données connectée à ${data.connection.host}`)
// })


//La deuxième méthode 

const mongoose = require("mongoose");

const connectDB = async ()=>{

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo connecté")
        
    } catch (error) {
        console.error('Problème de connexion avec mongodb',error.message);
        process.exit();
        
    }
}


module.exports = connectDB;