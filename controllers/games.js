const multer = require('../libs/multer')
const Game = require('../models/Game')

const gamesRoute = require('express').Router()

gamesRoute.route('/').get(async (request, response) => {
    const games = await Game.find({})
    response.json(games)
  })

gamesRoute.route('/:id').get(async (request, response) => {
  const { id } = request.params

  const games = await Game.findById(id).populate('matches')
  .then(resp => {
    if(resp){
      response.json(resp)
    } else {
      response.status(404).end()
    }
  })
})


gamesRoute.route('/').post( multer.single('gameImg'), async (request, response, next) => {

    const { id } = request.params
    const {gameImg, title, description, gameModes} = request.body
    console.log(id)
  
    const newGameInfo =  new Game({
      gameImg: request.file.path,
      title,
      description,
      gameModes
    });
    try {
        const savedGame = await newGameInfo.save()

        response.json(savedGame)
    }catch (error) {
        next(error)
    }
    }) 


    module.exports = gamesRoute