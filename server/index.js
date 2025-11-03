import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'
import { config } from 'dotenv'

config()

const app = express()
const PORT = Number(process.env.PORT ?? 3000)

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
  : null

if (allowedOrigins?.length) {
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true)
        }

        return callback(new Error('Origin not allowed by CORS policy'))
      },
      methods: ['POST', 'OPTIONS'],
    }),
  )
} else {
  app.use(cors())
}

app.use(express.json())

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? 'smtp.hostinger.com',
  port: Number(process.env.SMTP_PORT ?? 465),
  secure: (process.env.SMTP_SECURE ?? 'true').toLowerCase() === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const validateRequest = ({ name, email, message }) => {
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return 'All fields are required.'
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(email)) {
    return 'Please provide a valid email address.'
  }

  if (message.trim().length < 10) {
    return 'Message should be at least 10 characters long.'
  }

  return null
}

app.post('/api/contact', async (req, res) => {
  const { name = '', email = '', message = '' } = req.body ?? {}

  const validationError = validateRequest({ name, email, message })
  if (validationError) {
    return res.status(400).json({ success: false, message: validationError })
  }

  try {
    const fromAddress = process.env.MAIL_FROM_ADDRESS ?? process.env.SMTP_USER
    const toAddress = process.env.MAIL_TO_ADDRESS ?? process.env.SMTP_USER

    if (!fromAddress || !toAddress) {
      throw new Error('Mail from/to addresses are not configured.')
    }

    await transporter.sendMail({
      from: {
        name: name,
        address: fromAddress,
      },
      to: toAddress,
      replyTo: {
        name,
        address: email,
      },
      subject: `${process.env.MAIL_SUBJECT_PREFIX ?? 'New contact message'} from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <h2 style="margin-bottom: 16px;">New contact message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p style="white-space: pre-wrap; margin-top: 24px;">${message}</p>
        </div>
      `,
    })

    return res.json({ success: true })
  } catch (error) {
    console.error('Failed to send contact form message:', error)

    return res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' })
  }
})

app.get('/health', async (_, res) => {
  try {
    await transporter.verify()
    res.json({ status: 'ok' })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`Contact form server listening on port ${PORT}`)
})

