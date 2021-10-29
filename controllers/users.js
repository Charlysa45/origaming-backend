const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const usersRouter = require('express').Router()
const User = require('../models/User')

const transporter = require('../config/mailer')

usersRouter.get('/', async(request, response) =>{
    const users = await User.find({}).populate('profile avatar bannerImg matches')
    response.json(users)
})

usersRouter.get('/:id', (request, response) => {
    const { id } = request.params
    
    User.findById(id).populate('profile', {
      avatar: 1,
      bannerImg: 1,
      description: 1,
      country: 1,
      favGame: 1,
      rankGame: 1,
      date: 1
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

usersRouter.post('/', async (request, response) => {
    const {body} = request
    console.log(body)
    const {username, email, password, confirmCode} = body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    try {
      await transporter.sendMail({
        from: '"Origaming" <megamatr3x@gmail.com>',
        to: email,
        subject: 'Correo de verificación de cuenta',
        html: `<p>¡Bienvenid@ a Origaming, ${username}, para verificar la validez de tu correo, te hemos enviado un cógico de comprobación el cual deberás digitar en nuestra web.</p><br><h2>Código de verificación: ${confirmCode}</h2>`

      })
    } catch (error) {
      console.error(error)
    }

    const user = new User({
        username,
        email,
        passwordHash
    })

    const userForToken = {
        id: user._id,
        username: user.username
    }

    const token = jwt.sign(
        userForToken, 
        process.env.SECRET,
        {
            expiresIn: 60 * 60 * 24 
        })

    //enviar correos

    await user.save()

    response.json({
        username: user.username,
        email: user.email,
        token
    })
})

module.exports = usersRouter