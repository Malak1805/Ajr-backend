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

}, 
category: {
    type: String,
    enum: [
      'Medical & Health',
      'Education',
      'Disaster Relief',
      'Community & Social Causes',
      'Children & Orphans',
      'Animal Welfare',
      'Environmental Causes',
      'Religious & Charity'
    ],
   
  },
  image: {   
      type: String, 
      default: null
    }
},
{timestamps: true}


)

module.exports = mongoose.model('Post', postSchema)