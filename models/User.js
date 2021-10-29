const uniqueValidator = require('mongoose-unique-validator')
const {Schema,model} = require('mongoose')

const userSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    email: String,
    passwordHash: String,
    profile: [{
        type: Schema.Types.ObjectId,
        ref: 'UserProfile'
    }],
    avatar: [{
        type: Schema.Types.ObjectId,
        ref: 'Avatar'
    }],
    bannerImg: [{
        type: Schema.Types.ObjectId,
        ref: 'Banner'
    }],
    matches: [{
        type: Schema.Types.ObjectId,
        ref: 'Match'
    }],
    team: [{
        type: Schema.Types.ObjectId,
        ref: 'Team'
    }]
})

userSchema.set('toJSON', {
    transform:(document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v

        delete returnedObject.passwordHash
    }
})

userSchema.plugin(uniqueValidator)

const User = model('User', userSchema)

module.exports = User