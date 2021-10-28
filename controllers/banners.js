const jwt = require('jsonwebtoken')
const multer  = require('../libs/multer.js')
const cloudinary = require('cloudinary')
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const bannersRouter = require('express').Router()
const Banner = require('../models/Banner')
const User = require('../models/User')

bannersRouter.get('/', async (request, response) => {
    const banners = await Banner.find({}).populate('user', {
        username: 1,
        email: 1,
        id: 1
    })
    response.json(banners)
  })

bannersRouter.get('/:id', (request, response) => {
const { id } = request.params

Avatar.findById(id).populate('user', {
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

bannersRouter.route('/').post( async ( request, response, next) => {
const {bannerImg} = request.body

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

const newBannerImg = new Banner({
    bannerImg,
    user: user._id
})
try {
    const savedBanner = await newBannerImg.save()

    user.bannerImg = user.bannerImg.concat(savedBanner._id)
    await user.save()

    response.json(savedBanner)
}catch (error) {
    next(error)
}
}) 

bannersRouter.route('/:id').put( multer.single('bannerImg'), async (request, response, next) => {

    const { id } = request.params
    const {bannerImg} = request.body
    console.log(request.file)
    const result = await cloudinary.v2.uploader.upload(request.file.path)

    const newBannerImg = {
      bannerImg: result.url
    };
    
    await Banner.findByIdAndUpdate(id, newBannerImg, {new: true} )
    .then(res => {
      response.json(res)
    })
    }) 

module.exports = bannersRouter