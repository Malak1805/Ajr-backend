// routes/donationRouter.js
const router = require('express').Router()
const DonationCtrl = require('../controllers/donationController')
const middlewares = require('../middlewares')

// Make a donation to a post
router.post(
  '/:postId',
  middlewares.stripToken,
  middlewares.verifyToken,
  DonationCtrl.makeDonation
)

module.exports = router
