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
  required: true
},
created_at:{
  type: Date,
  required: true
}
}


)

module.exports = mongoose.model('Post', postSchema)