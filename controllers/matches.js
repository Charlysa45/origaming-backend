const jwt = require('jsonwebtoken')
const multer = require('../libs/multer')
const Game = require('../models/Game')
const Match = require('../models/Match')
const User = require('../models/User')

const matchesRoute = require('express').Router()

matchesRoute.route('/').get(async (request, response) => {
    const games = await Match.find({}).populate({path:'user', select:'avatar'})
    response.json(games)
  })

matchesRoute.route('/:id').get(async (request, response) => {
  const { id } = request.params
  const matches = await Match.findById(id).populate('user')
  .then(resp => {
    if(resp){
      response.json(resp)
    } else {
      response.status(404).end()
    }
  })
})

matchesRoute.route('/').post(async (request, response, next) => {
    const {gameId, gameChoosed, title, description, date} = request.body
    const authorization = request.get('authorization')
    let token = ''
  
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
      token = authorization.substring(7)
    }
  
    let decodeToken = {}
    try {
      decodeToken = jwt.verify(token, process.env.SECRET)
    } catch (error) {
      console.log(error)
    }
  
    if(!token || !decodeToken.id) {
      return response.status(401).json({error: 'token missing or invalid'})
    }
    
    const { id: userID } = decodeToken
    const user = await User.findById(userID)

    const { id: gameID } = gameId
    const game = await Game.findById(gameID)
  
    const newMatchInfo =  new Match({
      gameChoosed,
      title,
      description,
      user: user._id,
      game: game._id,
      date
    });

    try {
        const savedGame = await newMatchInfo.save()

        user.matches = user.matches.concat(savedGame._id)
        await user.save()

        game.matches = game.matches.concat(savedGame._id)
        await game.save()

        response.json(savedGame)
    }catch (error) {
        next(error)
    }
    })
    
    module.exports = matchesRoute