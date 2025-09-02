const Post = require('../models/Post')
const Donation = require('../models/Donation')
const mongoose = require('mongoose')

// Get all posts //added search
exports.getAllPosts = async (req, res) => {
  try {
const { category } = req.query //category filter
    let query = {}

    if (category) {
      query.category = category
    }

    const posts = await Post.find(query).populate(
      'userId',
      'first_name last_name' // populate user info
    )

    res.status(200).send({ posts })
  } catch (error) {
    console.error('Error fetching all posts:', error)
    res.status(500).send({ status: 'Error', msg: 'Failed to retrieve posts' })
  }
}


// Get a single post by Id with its donations
exports.getPostById = async (req, res) => {
  try {
    const postId = req.params.id 

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      console.error('Error fetching post by ID: Invalid ID format', postId)
      return res
        .status(400)
        .send({ status: 'Error', msg: 'Invalid post ID format' })
    }

    const post = await Post.findById(postId).populate(
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

    const { title, description, goal_amount, category } = req.body

    const image = req.file ? `/uploads/${req.file.filename}` : null // Save it path

    console.log(id)
    const post = new Post({
      title,
      description,
      goal_amount,
      category,
      userId: id,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    })
    await post.save()
    await post.populate('userId', 'first_name last_name email')

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

     const updatedData = {
      title: req.body.title,
      description: req.body.description,
      goal_amount: req.body.goal_amount,
      category: req.body.category,
    }

   
    if (req.file) {
      updatedData.image = `/uploads/${req.file.filename}`
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      updatedData,
      { new: true, runValidators: true }
    )

    res.status(200).send({
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

    res.status(200).send({
      status: 'Success',
      msg: 'Post deleted successfully',
      deletedPost
    })
  } catch (error) {
    console.error('Error deleting post:', error)
    res.status(500).send({ status: 'Error', msg: 'Failed to delete post' })
  }
}
