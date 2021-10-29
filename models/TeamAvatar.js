const {Schema,model} = require('mongoose')

const teamAvatarSchema = new Schema({
    teamAvatar: String,
    team: {
        type: Schema.Types.ObjectId,
        ref: 'Team'
    }
})

teamAvatarSchema.set('toJSON', {
    transform:(document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const TeamAvatar = model('TeamAvatar', teamAvatarSchema)

module.exports = TeamAvatar