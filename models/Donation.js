const mongoose = require('mongoose')


const donationSchema = new mongoose.Schema(
{
payment_status:{
  type: String,
  enum: ['pending', 'completed', 'cancelled']
},
amount:{
  type: Number,
  required: true
},
message:{
  type: String,
  required: true
},
created_at:{
  type: Date,
  required: true
},
}

)


module.exports = mongoose.model('Donation', donationSchema)