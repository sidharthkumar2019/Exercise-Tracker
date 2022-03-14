const {mongoose} = require('mongoose');
const {Schema} = mongoose;
const Exercise = require('./Exercise');

const userSchema = new Schema({
    username: String,
    count: Number,
    log: [Object]
});

const User = mongoose.model('user', userSchema);

module.exports = User;