require('dotenv').config()
const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const userApp = require('./API/user');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/build')));

const uri = process.env.MONGO_URI;
MongoClient.connect(uri)
.then((client) => {
  const database = client.db('fitnessApp');

  const userCollection = database.collection('userCollection');

  app.set('userCollection', userCollection);
  console.log('DB connection established');
})
.catch((error) => {console.log(error)})

app.listen(8000, () => {
  console.log('listening on port 8000');
})

app.use('/user', userApp)

app.use((err, req, res, next) => {
  res.send(`error generated ${err}`)
})
