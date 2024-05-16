const mongoose = require('mongoose');

const carouselSchema = new mongoose.Schema({
    images: [{
        type: String,
        required: true
    }],
    title: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    }
});

const Carousel = mongoose.model('Carousel', carouselSchema);

module.exports = Carousel;
