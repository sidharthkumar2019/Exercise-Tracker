const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const {mongoose} = require('mongoose');
const User = require('./models/User');
const {Schema} = mongoose;

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then( () => console.log('Connected to DB ...') )
  .catch( error => console.log(error.message) );



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
