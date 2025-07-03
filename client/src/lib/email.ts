import nodemailer from 'nodemailer'

const { EMAIL_HOST, EMAIL_USER, EMAIL_PASS } = process.env

let transporter: nodemailer.Transporter | null = null

export function getTransporter() {
  if (!transporter) {
    if (EMAIL_HOST && EMAIL_USER && EMAIL_PASS) {
      transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        auth: { user: EMAIL_USER, pass: EMAIL_PASS },
      })
    } else {
      transporter = nodemailer.createTransport({ jsonTransport: true })
    }
  }
  return transporter
}

export async function sendEmail(to: string, subject: string, text: string) {
  const trans = getTransporter()
  await trans.sendMail({ from: EMAIL_USER || 'no-reply@example.com', to, subject, text })
}
