const Comment = require('../models/Comment')

exports.addComment = async (req, res) => {
  try {
    const comment = new Comment({
      content: req.body.content,
      post: req.params.postId,
      user: req.session.user._id
    })
    await comment.save()
    res.redirect(`/posts/${req.params.postId}`)
  } catch (error) {
    res.redirect(`/posts/${req.params.postId}`)
  }
}

exports.deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id)
  if (comment.user.toString() === req.session.user._id.toString()) {
    await Comment.findByIdAndDelete(req.params.id)
  }
  res.redirect(`/posts/${comment.post}`)
}
