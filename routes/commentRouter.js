// routes/commentRouter.js
const router = require('express').Router()
const CommentCtrl = require('../controllers/commentController')
const middlewares = require('../middlewares')

// Add a comment to a post
router.post(
  '/:postId',
  middlewares.stripToken,
  middlewares.verifyToken,
  CommentCtrl.addComment
)

// Delete a comment
router.delete(
  '/:id',
  middlewares.stripToken,
  middlewares.verifyToken,
  CommentCtrl.deleteComment
)

router.get(
  '/:postId',
  CommentCtrl.getCommentsByPostId
)

module.exports = router
