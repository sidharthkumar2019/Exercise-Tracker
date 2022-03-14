const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser')
require('dotenv').config();
const {mongoose} = require('mongoose');
const User = require('./models/User');
const {Schema} = mongoose;

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.use(bodyParser.urlencoded({ extended: false }))

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then( () => console.log('Connected to DB ...') )
  .catch( error => console.log(error.message) );

app.post('/api/users', async(req, res)=> {
  let username = req.body.username;
  
  try {
    let record = await User.findOne({username: username});
    if ( record )
      res.json(record);
    else {
      let newRecord = new User({username: username});
      await newRecord.save();
      res.json(newRecord);
    }
  } catch (error) {
    console.log(error.message);
  }  
}); 

app.get('/api/users', async(req, res) => {
  let users = [];
  try {
    users = await User.find();
  } catch (error) {
    console.log(error.message);
  }

  res.json(users);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
