const {Schema,model} = require('mongoose')

const matchSchema = new Schema({
    gameChoosed: String,
    title: String,
    description: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    game: [{
        type: Schema.Types.ObjectId,
        ref: 'Game'
    }],
    date: String
})

matchSchema.set('toJSON', {
    transform:(document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Match = model('Match', matchSchema)

module.exports = Match