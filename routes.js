const User = require('./userModel');
const Exercise = require('./exerciseModel');
const express = require('express');
const Router = express.Router();
const bodyParser = require('body-parser');

Router.use(bodyParser.urlencoded({ extended: false}));

Router.post('/new-user', (req, res, next) => {
  User.create({username: req.body.username}, (err, user) => {
    if(err) {console.log(err); return next(err)};
    res.json({username: user.username, _id: user._id});
  });
  
});

Router.get('/log', (req, res, next) => {
  // User.find({})
  var { userId, from, to, limit } = req.query;
  from = from ? new Date(from) : new Date('1970-01-01');
  to = to ? new Date(to) : new Date();
  limit = limit ? limit : Number.MAX_SAFE_INTEGER;
  console.log(from, to, limit);
  
  // Exercise.find({userId}).where('date').gte(from).lte(to).limit(limit)
  //         .exec((err, exercises) => {
  //   if(err) return next(err);
  //   console.log(exercises);
  //   User.findOne({_id: userId}, (err, user) => {
  //     if(err) return next(err);
  //     user.log = exercises ? exercises : null;
  //     user.count = exercises ? exercises : 0;
  //     res.json(user);
  //   });
  // });
  User.findById(userId, (err, user) => {
    if(err) return next(err);
    Exercise.find({userId}).where('date').gte(from).lte(to).limit(limit)
            .exec((err, exercises) => {
      if(err) return next(err);
      // user.log = exercises ? exercises : null;
      // user.count = exercises ? exercises : 0;  why doesnt res.json(user) work?
      res.json({username: user.username, count: exercises.length, exercises});
    })
  })
});

Router.get('/users', (req, res, next) => {
  User.find({}, (err, users) => {
    if(err) return next(err);
    res.json(users);
  })
});

Router.post('/add', (req, res, next) => {
  // User.findById(req.body.userId, (err, user) =>{
  //   if(err) return next(err);
  //   // const newExercise = {description: req.body.description, duration, }
  //   if(!req.body.date) req.body.date = new Date();
  //   else req.body.date = new Date(req.body.date);
  //   Exercise.create(req.body, (err, exercise) => {
  //     if(err) return next(err);
  //     user.exercises.push(exercise);
  //     user.save((err, saved) => {
  //       if(err) return next(err);
  //       res.json(user);
  //     })
  //   })
  // })

  req.body.date = req.body.date ? new Date(req.body.date) : new Date();
  Exercise.create(req.body, (err, exercise) => {
    if(err) return next(err);
    User.findOne({_id: req.body.userId}, (err, user) => {
      if(err) return next(err);
      exercise.usename = user.username;
      res.json(exercise);
      // user.exercises.push(exercise);
      // user.save()
      // Exercise.find({userId: user._id}, (err, exercises) => {
      //   if(err) return next(err);
      //   res.json({user, exercises});
      //})
    })
  });
});

module.exports = Router;