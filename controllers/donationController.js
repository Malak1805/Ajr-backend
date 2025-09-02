const Donation = require('../models/Donation')
const Post = require('../models/Post')
const User = require('../models/User')


// Make a donation
exports.makeDonation = async (req, res) => {
  try {
    const { id: userId } = res.locals.payload
    const postId = req.params.postId
    const { amount, message } = req.body
    

    // Validate post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ status: 'Error', msg: 'Post not found' })
    }




    // Save donation
    const donation = await Donation.create({
      amount,
      message,
      user: userId,
      post: postId
    });

    // Update post current amount
    post.current_amount = (post.current_amount || 0) + amount
    await post.save();



    res.status(201).json({
      status: 'Success',
      msg: 'Donation made successfully',
      donation,
      postAmounts: {
        current_amount: post.current_amount,
        goal_amount: post.goal_amount
      }
    });
  } catch (error) {
    console.error('Error making donation:', error);
    res.status(500).json({ status: 'Error', msg: 'Failed to make donation' })
  }
}

// Get donations for a specific post
exports.getDonationsByPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const donations = await Donation.find({ post: postId })
      .populate('user', 'first_name last_name')

    if (!donations || donations.length === 0) {
      return res.status(404).json({ status: 'Error', msg: 'No donations found for this post' });
    }

    res.status(200).json({ status: 'Success', donations });
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ status: 'Error', msg: 'Failed to retrieve donations' });
  }
}

// Get all donations by a user
exports.getDonationsByUser = async (req, res) => {
  try {
    const { id: userId } = res.locals.payload;
    const donations = await Donation.find({ user: userId }).populate('post');

    res.status(200).json({
      status: 'Success',
      donations
    });
  } catch (error) {
    console.error('Error fetching user donations:', error);
    res.status(500).json({ status: 'Error', msg: 'Failed to retrieve donations' });
  }
}





