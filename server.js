const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser')
require('dotenv').config();
const {mongoose} = require('mongoose');
const User = require('./models/User');
const Exercise = require('./models/Exercise');
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
      res.send({username: record.username, _id: record._id});
    else {
      let newRecord = new User({username: username, count: 0, log: []});
      await newRecord.save();
      res.send({username: newRecord.username, _id: newRecord._id});
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

  res.send(users);
});

app.post('/api/users/:_id/exercises', async(req, res)=> {
  let user;
  try {
    user = await User.findOne({_id: req.params._id});
    if (!user) return res.status(404).send('User not found');
  } catch (error) {
    console.log(error);
    return res.send(error.message);
  }
  
  let {description, duration, date} = req.body;
  if (!date) date = (new Date()).toDateString();
  else date = (new Date(date)).toDateString();

  let newExercise = new Exercise({
    description: description,
    duration: duration,
    date: date
  });

  user.log.push(newExercise);
  user.count += 1;

  await user.save();

  res.send({
    description: newExercise.description,
    duration: newExercise.duration,
    date: newExercise.date,
    username: user.username,
    _id: user._id
  });
});

app.get('/api/users/:_id/logs', async(req, res) => {
  let user;
  try {
    user = await User.findOne({_id: req.params._id});
    if (!user) return res.status(404).send('User not found.');
  } catch (error) {
    console.log(error);
    return res.send(error);
  }

  const {from, to, limit} = req.query;
  if ( from && to && limit )
    user.log = user.log.filter(exercise => Date(exercise.date) >= Date(from) && Date(exercise.date) <= Date(to));
  if ( limit )
    user.log = user.log.slice(0, limit);
  res.send(user);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
