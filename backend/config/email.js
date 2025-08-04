const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

function sendPasswordResetEmail(to, resetLink) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Recuperação de Senha',
        html: `<p>Você solicitou a recuperação de senha.</p><p>Clique no link para redefinir sua senha: <a href="${resetLink}">${resetLink}</a></p>`
    };
    return transporter.sendMail(mailOptions);
}

module.exports = { sendPasswordResetEmail };
