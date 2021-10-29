const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'origamingmessages@gmail.com',
        pass: 'ffreaifnhykxtflp'
    }
})

transporter.verify().then(()=> {
    console.log("Listo para enviar correos")
})

module.exports = transporter;