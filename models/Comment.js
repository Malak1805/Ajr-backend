const mongoose = require('mongoose')
const { type } = require('os')

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true
    },
    userId:{
     type: String,
     required: true
    },
    postId:{
      type: Number,
      required: true
    },
    timestamps: true
  }
)

module.exports = mongoose.model('Comment', commentSchema)