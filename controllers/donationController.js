const Donation = require('../models/Donation')
const Post = require('../models/Post')

// Make a donation to a post
exports.makeDonation = async (req, res) => {
  try {
    const { id: userId } = res.locals.payload
    const postId = req.params.postId
    const { amount, message } = req.body

    // Validate if the post exists
    const post = await Post.findById(postId)
    if (!post) {
      return res
        .status(404)
        .send({ status: 'Error', msg: 'Post not found for donation' })
    }

    // Create a new donation
    const donation = new Donation({
      amount,
      message,
      user: userId,
      post: postId,
      payment_status: 'completed'
    })
    await donation.save()

    // Update the current_amount of the post
    post.current_amount = (post.current_amount || 0) + amount
    await post.save()

    res.status(201).send({
      status: 'Success',
      msg: 'Donation made successfully',
      donation,
      postAmounts: {
        // Added postAmounts to the response
        current_amount: post.current_amount,
        goal_amount: post.goal_amount
      }
    })
  } catch (error) {
    console.error('Error making donation:', error)
    res.status(500).send({ status: 'Error', msg: 'Failed to make donation' })
  }
}

// Get All Donations of a Specific Post
exports.getDonationsByPost = async (req, res) => {
  try {
    const postId = req.params.postId // Find all donations that belong to the specified post

    const donations = await Donation.find({ post: postId }).populate(
      'user',
      'first_name last_name'
    ) // Populate to show the donor's name

    if (!donations) {
      return res
        .status(404)
        .send({ status: 'Error', msg: 'No donations found for this post' })
    }

    res.status(200).send({
      status: 'Success',
      msg: 'Donations retrieved successfully',
      donations: donations
    })
  } catch (error) {
    console.error('Error fetching donations:', error)
    res
      .status(500)
      .send({ status: 'Error', msg: 'Failed to retrieve donations' })
  }
}


exports.getDonationsByUser = async (req, res) => {
    try {
        const { id: userId } = res.locals.payload; // Get user ID from the token

        const userDonations = await Donation.find({ user: userId }).populate('post');
        
        // Extract unique posts from the user's donations
        const donatedPosts = [];
        const postIds = new Set();
        userDonations.forEach(donation => {
            if (donation.post && !postIds.has(donation.post._id.toString())) {
                donatedPosts.push(donation.post);
                postIds.add(donation.post._id.toString());
            }
        });

        res.status(200).json({
            status: 'Success',
            msg: 'Donated posts retrieved successfully',
            donatedPosts
        });
    } catch (error) {
        console.error("Error fetching user's donations:", error);
        res.status(500).json({ status: 'Error', msg: 'Failed to retrieve donated posts' });
    }
};