const Question = require('../models/questions')

class QuestionController {
  static create(req,res,next) {
    // console.log(req.decoded) 
    Question.create({
      title: req.body.title,
      content: req.body.content,
      userId: req.decoded._id,
      upVotes: [req.decoded._id]
      // downVotes: [] 
    })
      .then((dataCreated) => {
        res.status(201).json(dataCreated)
      })
      .catch(next)
  }

  static getAllQuestions(req,res,next) {
    Question.find().populate('userId').populate('answerId')
      .then((dataFound) => {
        res.status(200).json(dataFound)
      })
      .catch(next)
  }

  static getQuestionByUser(req,res,next) {
    Question.find({userId: req.decoded._id}).populate('userId')
      .then((dataFound) => {
        res.status(200).json(dataFound)
      })
      .catch(next)
  }

  static upvote(req,res,next) {
    Question.findById(req.params.id)
      .then((dataFound) => {
        // console.log(dataFound)
        let found = dataFound.upVotes.filter((userId) => userId == req.decoded._id)
        if(found.length == 0) {
          dataFound.upVotes.push(req.decoded._id)
          // console.log(dataFound)  
          let index = dataFound.downVotes.findIndex((userId) => userId == req.decoded._id)
          if(index !== -1) {
            dataFound.downVotes.splice(index,1)
          }
          return dataFound.save()
        } else {
          throw {status: 400, message: 'cannot like the same thing twice'}
        }
      })
      .then((dataUpdated) => {
        // console.log(dataUpdated)
        res.status(200).json(dataUpdated)
      })
      .catch(next)
  }

  static downvote(req,res,next) {
    Question.findById(req.params.id)
      .then((dataFound) => {
        console.log(dataFound, 'data downvote ketemu')
        let found = dataFound.downVotes.filter((userId) => userId == req.decoded._id)
        console.log(found, 'ini found filter')
        if(found.length == 0) {
          dataFound.downVotes.push(req.decoded._id)
          // console.log(dataFound)  
          let index = dataFound.upVotes.findIndex((userId) => userId == req.decoded._id)
          console.log(index, 'ini index')
          if(index !== -1) {
            console.log('halooo masuk index')
            dataFound.upVotes.splice(index,1)
          }
          return dataFound.save()
        } else {
          throw {status: 400, message: 'cannot like the same thing twice'}
        }
      })
      .then((dataUpdated) => {
        console.log(dataUpdated)
        res.status(200).json(dataUpdated)
      })
      .catch(next)
  }
}

module.exports = QuestionController