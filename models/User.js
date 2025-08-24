const mongoose = require('mongoose')


const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true
    },
    last_name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone_number: {
      type: Number
    },
    address: {
      type: String,
      required: true
    }
  }
)

module.exports = mongoose.model('User', userSchema)