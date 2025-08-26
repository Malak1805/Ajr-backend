const Donation = require('../models/Donation');
const Post = require('../models/Post'); 

// Make a donation to a post
exports.makeDonation = async (req, res) => {
  try {
    const { id: userId } = res.locals.payload;
    const postId = req.params.postId;
    const { amount, message } = req.body;

    // Validate if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send({ status: 'Error', msg: 'Post not found for donation' });
    }

    // Create a new donation
    const donation = new Donation({
      amount,
      message,
      user: userId, 
      post: postId,
      payment_status: 'completed' 
    });
    await donation.save();

    // Update the current_amount of the post
    post.current_amount = (post.current_amount || 0) + amount;
    await post.save();

    res.status(201).send({
      status: 'Success',
      msg: 'Donation made successfully',
      donation,
      postAmounts: { // Added postAmounts to the response
        current_amount: post.current_amount,
        goal_amount: post.goal_amount}
    }); 

    // Respond with the newly created donation
    res.status(201).send({ status: 'Success', msg: 'Donation made successfully', donation }); 
  } catch (error) {
    console.error("Error making donation:", error);
    res.status(500).send({ status: 'Error', msg: 'Failed to make donation' });
  }
};