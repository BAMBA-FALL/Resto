const mongoose = require("mongoose");

const connectDB  = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI, console.log(
            "Mongo connecté"
        ));

    }catch(err) {
        console.error(err.message);
        process.exit();
    };
};

module.exports = connectDB;