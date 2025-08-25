const Donation = require('../models/Donation')

exports.makeDonation = async (req, res) => {
  try {
    const donation = new Donation({
      amount: req.body.amount,
      message: req.body.message,
      user: req.session.user._id,
      post: req.params.postId
    })
    await donation.save()
    res.redirect(`/posts/${req.params.postId}`)
  } catch (error) {
    res.redirect(`/posts/${req.params.postId}`)
  }
}
