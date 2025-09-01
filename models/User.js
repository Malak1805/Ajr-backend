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
    password_digest: {
      type: String,
      required: true     
    },
    phone_number: {
      type: Number
    },
    address: {
      type: String,
      required: true
    },
    

    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date }
    
  },{ timestamps: true }
)

module.exports = mongoose.model('User', userSchema)