const Post = require('../models/Post')
const Donation = require('../models/Donation')

// Show all posts
exports.getAllPosts = async (req, res) => {
  const posts = await Post.find().populate('userId')
  res.render('posts/index', { posts })
}

// Show single post + donations
exports.getPostById = async (req, res) => {
  const post = await Post.findById(req.params.id).populate('userId')

  const donations = await Donation.find({ post: post._id }).populate('user')

  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0)

  res.render('posts/show', { post, donations, totalDonations })
}

// Create post
exports.createPost = async (req, res) => {
  try {
    const post = new Post({
      title: req.body.title,
      description: req.body.description,
      goal_amount: req.body.goal_amount,
      userId: req.session.user._id
    })
    await post.save()
    res.redirect('/posts')
  } catch (error) {
    res.render('posts/new', { error: 'Could not create post' })
  }
}

// Edit post
exports.editPost = async (req, res) => {
  const post = await Post.findById(req.params.id)
  if (!post || post.userId.toString() !== req.session.user._id.toString()) {
    return res.redirect('/posts')
  }
  res.render('posts/edit', { post })
}

// Update post
exports.updatePost = async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    description: req.body.description,
    goal_amount: req.body.goal_amount
  })
  res.redirect(`/posts/${req.params.id}`)
}

// Delete post
exports.deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id)
  if (post.userId.toString() !== req.session.user._id.toString()) {
    return res.redirect('/posts')
  }
  await Post.findByIdAndDelete(req.params.id)
  res.redirect('/posts')
}
