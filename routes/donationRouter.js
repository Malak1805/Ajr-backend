// routes/donationRouter.js
const router = require('express').Router()
const DonationCtrl = require('../controllers/donationController')
const middlewares = require('../middlewares')


// To get donations of a specific user
router.get(
    '/my-donations',
    middlewares.stripToken,
    middlewares.verifyToken,
    DonationCtrl.getDonationsByUser
)

// Make a donation to a post
router.post(
  '/:postId',
  middlewares.stripToken,
  middlewares.verifyToken,
  DonationCtrl.makeDonation
)

// Get all donations for a specific post
router.get(
  '/:postId',
  DonationCtrl.getDonationsByPost
)


module.exports = router