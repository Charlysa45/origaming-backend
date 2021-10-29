const {Schema,model} = require('mongoose')

const teamBannerSchema = new Schema({
    teamBannerImg: String,
    team: {
        type: Schema.Types.ObjectId,
        ref: 'Team'
    }
})

teamBannerSchema.set('toJSON', {
    transform:(document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const TeamBanner = model('TeamBanner', teamBannerSchema)

module.exports = TeamBanner