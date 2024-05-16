const mongoose = require("mongoose");

const apiModel = new mongoose.Schema(
    {
        message: {
            type: String, 
            required : true,
        },
        author: {
            type: String, 
            required: true,
        },
        likers: {
            type: [String]
        },
    },

    {
        timestamps: true,
    }
);


module.exports = mongoose.model("api", apiModel);