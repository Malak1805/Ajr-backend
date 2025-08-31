// routes/postRouter.js
const router = require('express').Router()
const PostCtrl = require('../controllers/postController')
const middlewares = require('../middlewares')
const upload = require('../middlewares/upload')

// Get all posts
router.get('/', PostCtrl.getAllPosts)

// Get single post by id
router.get('/:id', PostCtrl.getPostById)

// Create a post (requires login)
router.post(
  '/',
  middlewares.stripToken,
  middlewares.verifyToken,
  upload.single('image'),
  PostCtrl.createPost
)

// Edit post form
router.get(
  '/:id/edit',
  middlewares.stripToken,
  middlewares.verifyToken,
  PostCtrl.editPost
)

// Update post
router.put(
  '/:id',
  middlewares.stripToken,
  middlewares.verifyToken,
  upload.single('image'),
  PostCtrl.updatePost
)

// Delete post
router.delete(
  '/:id',
  middlewares.stripToken,
  middlewares.verifyToken,
  PostCtrl.deletePost
)

module.exports = router
