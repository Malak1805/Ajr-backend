const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
{
  title:{
type: String,
required: true
  },
description:{
  type: String,
  required: true
},
goal_amount:{
  type: Number,
  required: true
},
current_amount:{
  type: Number,
  default: 0
},
userId:{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true
}
},
{timestamps: true}


)

module.exports = mongoose.model('Post', postSchema)