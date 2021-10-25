const profilesRouter = require('express').Router()
const User = require('../models/User')
const UserProfile = require('../models/UserProfile')

const jwt = require('jsonwebtoken')
const multer  = require('../libs/multer.js')
const path = require('path')


profilesRouter.get('/', async (request, response) => {
  const profiles = await UserProfile.find({}).populate('user', {
    username: 1,
    email: 1,
    id: 1
  })
  response.json(profiles)
})

profilesRouter.get('/:id', (request, response) => {
  const { id } = request.params
  
  UserProfile.findById(id).populate('user', {
    username: 1,
    email: 1,
    id: 1
})
.then(user =>{
    if (user) {
      response.json(user)
    } else {
      response.status(404).end()
    }
  }).catch(err => {
    next(err)
  })

})

profilesRouter.route('/').post( async ( request, response, next) => {
  const {bannerImg, description, country, favGame, rankGame} = request.body

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
  console.log(user)
  
  const newProfile = new UserProfile({
      bannerImg,
      description,
      country,
      favGame,
      rankGame,
      user: user._id
  })
  try {
      const savedProfile = await newProfile.save()
  
      user.profile = user.profile.concat(savedProfile._id)
      await user.save()
  
      response.json(savedProfile)
  }catch (error) {
      next(error)
  }
  }) 

profilesRouter.route('/:id').put( multer.single('avatar'), async (request, response, next) => {

  const { id } = request.params
  const {bannerImg, description, country, favGame, rankGame} = request.body
  console.log(id)

  const newProfileInfo = {
    bannerImg,
    description,
    country,
    favGame,
    rankGame
  };
  
  await UserProfile.findByIdAndUpdate(id, newProfileInfo, {new: true} )
  .then(res => {
    response.json(res)
  })
  }) 

  module.exports = profilesRouter