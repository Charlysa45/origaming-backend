const {Schema,model} = require('mongoose')

const gameSchema = new Schema({
    gameImg: String,
    title: String,
    description: String,
    gameModes: String,
    matches: [{
        type: Schema.Types.ObjectId,
        ref: 'Match'
    }]
})

gameSchema.set('toJSON', {
    transform:(document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Game = model('Game', gameSchema)

module.exports = Game