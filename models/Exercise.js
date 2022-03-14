const {mongoose} = require('mongoose');
const {Schema} = mongoose;

const exerciseSchema = new Schema({
    description: String,
    duration: Number,
    date: String
});

const Exercise = new mongoose.model('exercise', exerciseSchema);

module.exports = Exercise;