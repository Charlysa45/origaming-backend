const {Schema,model} = require('mongoose')

const userSchema = new Schema({
    bannerImg: String,
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

const Banner = model('Banner', userSchema)

module.exports = Banner