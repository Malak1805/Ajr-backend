const mongoose = require('mongoose')


const donationSchema = new mongoose.Schema(
{
payment_status:{
  type: String,
  enum: ['pending', 'completed', 'cancelled'],
  default: 'pending'
},
amount:{
  type: Number,
  required: true
},
message:{
  type: String
},
userId:{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Post',
  required: true
},
},{timestamps: true}

)


module.exports = mongoose.model('Donation', donationSchema)