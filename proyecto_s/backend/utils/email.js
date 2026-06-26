import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

export const enviarCodigo = async (email, codigo) => {

    await transporter.sendMail({
        from: `"PlayMatch" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Código de verificación",
        html: `
            <h2>Bienvenido a PlayMatch</h2>

            <p>Tu código de verificación es:</p>

            <h1 style="letter-spacing:6px">
                ${codigo}
            </h1>

            <p>Este código vence en 10 minutos.</p>
        `
    });
}