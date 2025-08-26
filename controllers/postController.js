const Post = require('../models/Post')
const Donation = require('../models/Donation')

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
    res.status(200).send(posts)
  } catch (error) {
    console.error('Error fetching all posts:', error)
    res.status(500).send({ status: 'Error', msg: 'Failed to retrieve posts' })
  }
}

// Get a single post by Id with its donations
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      'userId',
      'first_name last_name email'
    )
    if (!post) {
      return res.status(404).send({ status: 'Error', msg: 'Post not found' })
    }

    const donations = await Donation.find({ post: post._id }).populate(
      'user',
      'first_name last_name email'
    )
    const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0)

    res.status(200).send({ post, donations, totalDonations })
  } catch (error) {
    console.error('Error fetching post by ID:', error)
    res
      .status(500)
      .send({ status: 'Error', msg: 'Failed to retrieve post details' })
  }
}

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { id } = res.locals.payload

    const { title, description, goal_amount } = req.body
    console.log(id)
    const post = new Post({
      title,
      description,
      goal_amount,
      userId: id
    })
    await post.save()

    res.status(201).send(post)
  } catch (error) {
    console.error('Error creating post:', error)
    res.status(500).send({ status: 'Error', msg: 'Could not create post' })
  }
}

// Edit post - fetches the post data for client-side editing
exports.editPost = async (req, res) => {
  try {
    const { id: userId } = res.locals.payload // Get authenticated user ID
    const postId = req.params.id

    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).send({ status: 'Error', msg: 'Post not found' })
    }

    // Optional: Ensure only the owner can fetch data for editing
    if (post.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .send({ status: 'Error', msg: 'Unauthorized to edit this post' })
    }

    // Send the post data back as JSON
    res.status(200).send(post)
  } catch (error) {
    console.error('Error fetching post for editing:', error)
    res
      .status(500)
      .send({ status: 'Error', msg: 'Failed to retrieve post for editing' })
  }
}

// Update an existing post
exports.updatePost = async (req, res) => {
  try {
    const { id: userId } = res.locals.payload
    const postId = req.params.id

    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).send({ status: 'Error', msg: 'Post not found' })
    }

    if (post.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .send({ status: 'Error', msg: 'Unauthorized to update this post' })
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        title: req.body.title,
        description: req.body.description,
        goal_amount: req.body.goal_amount
      },
      { new: true, runValidators: true }
    )

    res
      .status(200)
      .send({
        status: 'Success',
        msg: 'Post updated successfully',
        updatedPost
      })
  } catch (error) {
    console.error('Error updating post:', error)
    res.status(500).send({ status: 'Error', msg: 'Failed to update post' })
  }
}

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const { id: userId } = res.locals.payload
    const postId = req.params.id

    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).send({ status: 'Error', msg: 'Post not found' })
    }

    // Ensure only the owner can delete the post
    if (post.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .send({ status: 'Error', msg: 'Unauthorized to delete this post' })
    }

    const deletedPost = await Post.findByIdAndDelete(postId)

    res
      .status(200)
      .send({
        status: 'Success',
        msg: 'Post deleted successfully',
        deletedPost
      })
  } catch (error) {
    console.error('Error deleting post:', error)
    res.status(500).send({ status: 'Error', msg: 'Failed to delete post' })
  }
}
