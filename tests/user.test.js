const bcrypt = require('bcrypt')
const User = require("../models/User")

describe('creando un nuevo usuario', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('pswd', 10)
    })
})