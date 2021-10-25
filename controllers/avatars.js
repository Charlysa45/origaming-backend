const jwt = require('jsonwebtoken')
const multer  = require('../libs/multer.js')

const avatarsRouter = require('express').Router()
const Avatar = require('../models/Avatar')
const User = require('../models/User')

avatarsRouter.get('/', async (request, response) => {
    const avatars = await Avatar.find({}).populate('user', {
        username: 1,
        email: 1,
        id: 1
    })
    response.json(avatars)
  })

avatarsRouter.get('/:id', (request, response) => {
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
    console.error(err)
})

})  

avatarsRouter.route('/').post( async ( request, response, next) => {
const {avatar} = request.body

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

const newAvatar = new Avatar({
    avatar,
    user: user._id
})
try {
    const savedAvatar = await newAvatar.save()

    user.avatar = user.avatar.concat(savedAvatar._id)
    await user.save()

    response.json(savedAvatar)
}catch (error) {
    next(error)
}
}) 

avatarsRouter.route('/:id').put( multer.single('avatar'), async (request, response, next) => {

    const { id } = request.params
    const {avatar} = request.body
    console.log(request.file)
    const newAvatar = {
      avatar: request.file.path
    };
    
    await Avatar.findByIdAndUpdate(id, newAvatar, {new: true} )
    .then(res => {
      response.json(res)
    })
    }) 

module.exports = avatarsRouter
