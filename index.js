require('dotenv').config()
require('./mongo.js')

const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const cors = require('cors')

const usersRouter = require('./controllers/users')
const profilesRouter = require('./controllers/profiles.js')
const avatarsRouter = require('./controllers/avatars.js')
const bannersRouter = require('./controllers/banners.js')
const loginRouter = require('./controllers/login.js')

const gamesRoute = require('./controllers/games.js')
const matchesRoute = require('./controllers/matches.js')
const teamsRouter = require('./controllers/teams.js')
const teamAvatarsRouter = require('./controllers/teamAvatars.js')
const teamBannersRouter = require('./controllers/teamBanners.js')

const app = express()

const server = http.createServer(app)
const io = socketio(server, {
  cors:{
    origin: "http://localhost:3000",    
    methods: ["GET", "POST"],
    allowedHeaders: ["chat-header"],    
    credentials: true
  }
})

//Servidor Socket
io.on('connection', socket => {
  let nombre;
  let sala;
  
  socket.on('conectado', (nomb) => {
    nombre = nomb.username
    sala = nomb.matchId
    // socket.broadcast.emit('mensajes', {nombre: nombre, mensaje: `${nombre} ha entrado en el encuentro`})
    console.log(`${nombre} esta entrando en la sala ${sala}`)
    socket.join(sala)

    socket.emit('mensajes', {nombre: nombre, mensaje: `Bienvenido al encuentro ${sala}, ${nombre}!`})

    socket.broadcast.to(nomb.matchId).emit('mensajes', {nombre: nombre, mensaje: `${nombre} ha entrado en el encuentro: ${sala}`})
  })

  socket.on('mensaje', (nombre, mensaje) => {
    console.log(`se envio un mensaje a la sala ${sala}`)
    io.to(sala).emit("mensajes", {nombre, mensaje});
  })

  socket.on('disconnect', () => {
    io.to(sala).emit('mensajes', {servidor: 'Servidor', mensaje: `${nombre} ha abandonado el encuentro`})
  })
  
})

app.use(cors())
app.use(express.json())

app.use((request, response, next) => {
  console.log(request.method)
  console.log(request.path)
  console.log(request.body)
  console.log('----------')
  next()
}) 


app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.use(express.static(__dirname + '/public'));

app.use((error, request, response, next) =>{
  console.error(error)
  
  if(error.name === 'CastError'){
    response.status(400).send({error: 'la id usada está malformada'}) 
  }else{
    response.status(500).end()
  }
})

app.use('/api/users', usersRouter)
app.use('/api/profiles', profilesRouter)
app.use('/api/login', loginRouter)
app.use('/api/avatars', avatarsRouter)
app.use('/api/banners', bannersRouter)

app.use('/api/games', gamesRoute)
app.use('/api/matches', matchesRoute)
app.use('/api/teams', teamsRouter)
app.use('/api/teamAvatars', teamAvatarsRouter)
app.use('/api/teamBanners', teamBannersRouter)


const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

