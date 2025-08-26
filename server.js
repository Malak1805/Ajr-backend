//imports
const express = require('express')
require('dotenv').config()
const cors = require('cors')
const path = require('path')

//intialize app
const app = express()

const mongoose = require('./config/db')


const port = process.env.PORT ? process.env.PORT : 3000

const morgan = require('morgan')


//middlewares

app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())
app.use(express.json())

//
app.get('/', (req, res) => {
  res.send('Your app is connected . . . ')
})

// test - zainab
//require routers
const commentRouter = require('./routes/commentRouter')
const donationRouter = require('./routes/donationRouter')
const postRouter = require('./routes/postRouter')
const UserRt = require('./routes/userRouter')


//use routers
app.use('/comments', commentRouter)
app.use('/donations', donationRouter)
app.use('/posts', postRouter)
app.use('/auth', UserRt)


//use listener
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})


