const express = require('express');
const userApp = express.Router();
const bcryptjs = require('bcryptjs');

let refEmail;
let userCollection;

userApp.use((req, res, next) => {
  userCollection = req.app.get('userCollection');
  next();
})

userApp.post('/register', async (req, res) => {
  const newUser = req.body;
  const email = await userCollection.findOne({email : newUser.email});
  if(email !== null){
    return res.send({message : email})
  }
  newUser.password = await bcryptjs.hash(newUser.password, 7);
  await userCollection.insertOne(newUser);
  res.send({message : 'Account created successfully'})
})

userApp.post('/login', async (req, res) => {
  const user = req.body;
  const validUser = await userCollection.findOne({email : user.email});
  if(validUser === null) { return res.send({message : 'user not found'});}
  const passCheck = await bcryptjs.compare(user.password, validUser.password);
  if(passCheck === false) { return res.send({message : 'Invalid password'});}
  refEmail = user.email;
  res.send({message : 'exist'})
})

userApp.put('/exercise', async (req, res) => {
  const exercise = req.body;
  await userCollection.findOneAndUpdate(
    {email : refEmail},
    {$addToSet : {exercises : exercise.exer}},
    {ReturnDocument : 'after'}
  )
})

module.exports = userApp;
