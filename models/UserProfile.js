const {Schema,model} = require('mongoose')

const userSchema = new Schema({
    description: String,
    country: String,
    favGame: String,
    rankGame: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

userSchema.set('toJSON', {
    transform:(document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const UserProfile = model('UserProfile', userSchema)

module.exports = UserProfile