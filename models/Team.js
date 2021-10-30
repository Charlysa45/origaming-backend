const {Schema,model} = require('mongoose')

const teamSchema = new Schema({
    teamName: String,
    gameChoosed: String,
    description: String,
    teamLeader: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    teamAvatar: [{
        type: Schema.Types.ObjectId,
        ref: 'TeamAvatar'
    }],
    teamBannerImg: [{
        type: Schema.Types.ObjectId,
        ref: 'TeamBanner'
    }],
    members: {
        type: Array,
        default: []
    }
})

teamSchema.set('toJSON', {
    transform:(document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Match = model('Team', teamSchema)

module.exports = Match