const jwt = require('jsonwebtoken')
const multer  = require('../libs/multer.js')
const cloudinary = require('cloudinary')
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const teamBannersRouter = require('express').Router()
const TeamBanner = require('../models/TeamBanner')
const Team = require('../models/Team')

teamBannersRouter.get('/', async (request, response) => {
    const teamBanners = await TeamBanner.find({}).populate('team')
    response.json(teamBanners)
  })

teamBannersRouter.get('/:id', (request, response) => {
const { id } = request.params

TeamBanner.findById(id).populate('team')
.then(user =>{
    if (user) {
    response.json(user)
    } else {
    response.status(404).end()
    }
}).catch(err => {
    console.error(err);
})

})  

teamBannersRouter.route('/').post( async ( request, response, next) => {
const {teamBannerImg, teamId} = request.body

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

const newTeamBannerImg = new TeamBanner({
    teamBannerImg,
    team: team._id
})
try {
    const savedTeamBanner = await newTeamBannerImg.save()

    team.teamBannerImg = team.teamBannerImg.concat(savedTeamBanner._id)
    await team.save()

    response.json(savedTeamBanner)
}catch (error) { 
    next(error)
}
}) 

teamBannersRouter.route('/:id').put( multer.single('teamBannerImg'), async (request, response, next) => {

    const { id } = request.params
    const {bannerImg} = request.body
    console.log(request.file)
    const result = await cloudinary.v2.uploader.upload(request.file.path)

    const newBannerImg = {
      teamBannerImg: result.url
    };
    
    await TeamBanner.findByIdAndUpdate(id, newBannerImg, {new: true} )
    .then(res => {
      response.json(res)
    })
    }) 

module.exports = teamBannersRouter