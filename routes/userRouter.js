const router = require('express').Router()
const UserCtrl = require('../controllers/userController')
const middlewares = require('../middlewares')

router.post('/login', UserCtrl.login)
router.post('/register', UserCtrl.register)
router.put(
  '/password',
  middlewares.stripToken,
  middlewares.verifyToken,
  UserCtrl.updatePassword
)

router.put(
  '/profile',
  middlewares.stripToken,
  middlewares.verifyToken,
  UserCtrl.updateProfile
)
router.get(
  '/profile',
  middlewares.stripToken,
  middlewares.verifyToken,
  UserCtrl.getProfileById
)

router.delete(
  '/profile',
  middlewares.stripToken,
  middlewares.verifyToken,
  UserCtrl.deleteProfile
)
router.get(
  '/session',
  middlewares.stripToken,
  middlewares.verifyToken,
  middlewares.CheckSession
)

module.exports = router