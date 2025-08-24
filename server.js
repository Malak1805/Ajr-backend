//imports
const express = require('express')
require('dotenv').config
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


//require routers



//use routers



//use listener
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})


