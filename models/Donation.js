const mongoose = require('mongoose')


const donationSchema = new mongoose.Schema(
{

amount:{
  type: Number,
  required: true
},
message:{
  type: String
},
user:{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true
},
post:{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Post',
  required: true
}

  
},{timestamps: true}

)


module.exports = mongoose.model('Donation', donationSchema)