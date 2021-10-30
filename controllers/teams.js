const teamsRouter = require('express').Router()
const User = require('../models/User')
const Team = require('../models/Team')

const jwt = require('jsonwebtoken')
const multer  = require('../libs/multer.js')

teamsRouter.get('/', async (request, response) => {
    const teams = await Team.find({}).populate('teamLeader teamAvatar teamBannerImg')
    response.json(teams)
  })
  
  teamsRouter.get('/:id', (request, response) => {
    const { id } = request.params
    
    Team.findById(id).populate('teamLeader teamAvatar teamBannerImg')
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
  
  teamsRouter.route('/').post( async ( request, response, next) => {
    const {teamName, gameChoosed, description} = request.body
  
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
    
    const newTeam = new Team({
        teamName,
        gameChoosed,
        description,
        teamLeader: user._id
    })
    try {
        const savedTeam = await newTeam.save()
    
        user.team = user.team.concat(savedTeam._id)
        await user.save()
    
        response.json(savedTeam)
    }catch (error) {
        next(error)
    }
    }) 
  
  teamsRouter.route('/:id').put( async (request, response, next) => {
  
    const { id } = request.params
    const {gameChoosed, description} = request.body
    const team = await Team.findById(id)
  
    const newTeamProfileInfo = {
      gameChoosed,
      description
    };
    
    await Team.findByIdAndUpdate(id, newTeamProfileInfo, {new: true} )
    .then(res => {
      response.json(res)
    })
    })

  teamsRouter.route('/:id/follow').put( async (request, response, next) => {
    const TeamId = request.params.id
    console.log(TeamId)
    const  {memberId}  = request.body
    console.log(memberId)
    if(!TeamId !== memberId){
      try {
        const team = await Team.findById(TeamId)
        const currentUser = await User.findById(memberId)
        if (!team.members.includes(memberId)) {
          await team.updateOne({$push: {members: memberId}})
          response.status(200).json('Bien! usuario seguido')
        } else {
          response.status(403).json('Nope, ya esta registrado')
        }

      } catch (error) {
        response.status(500).json(error)
      }
    }else{
      response.status(403).json('Bruh')
    }
    })
    
    module.exports = teamsRouter