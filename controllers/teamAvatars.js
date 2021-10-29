const jwt = require('jsonwebtoken')
const multer  = require('../libs/multer.js')
const cloudinary = require('cloudinary')
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const teamAvatarsRouter = require('express').Router()
const TeamAvatar = require('../models/TeamAvatar')
const Team = require('../models/Team')

teamAvatarsRouter.get('/', async (request, response) => {
    const teamAvatars = await TeamAvatar.find({}).populate('team')
    response.json(teamAvatars)
  })

teamAvatarsRouter.get('/:id', (request, response) => {
const { id } = request.params

TeamAvatar.findById(id).populate('team')
.then(user =>{
    if (user) {
    response.json(user)
    } else {
    response.status(404).end()
    }
}).catch(err => {
    console.error(err)
})

})  

teamAvatarsRouter.route('/').post( async ( request, response, next) => {
const {teamAvatar, teamId} = request.body

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

const team = await Team.findById(teamId)
console.log(team)

const newTeamAvatar = new TeamAvatar({
    teamAvatar,
    team: team._id
})
try {
    const savedTeamAvatar = await newTeamAvatar.save()

    team.teamAvatar = team.teamAvatar.concat(savedTeamAvatar._id)
    await team.save()

    response.json(savedTeamAvatar)
}catch (error) {
    next(error)
}
}) 

teamAvatarsRouter.route('/:id').put( multer.single('avatar'), async (request, response, next) => {

    const { id } = request.params
    const {avatar} = request.body
    console.log(request.file)
    const result = await cloudinary.v2.uploader.upload(request.file.path)
    
    const newAvatar = {
      avatar: result.url
    };
    
    await Avatar.findByIdAndUpdate(id, newAvatar, {new: true} )
    .then(res => {
      response.json(res)
    })
    }) 

module.exports = teamAvatarsRouter