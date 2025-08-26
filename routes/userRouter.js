const router = require('express').Router()
const UserCtrl = require('../controllers/userController')
const middlewares = require('../middlewares')

router.post('/login', UserCtrl.login)
router.post('/register', UserCtrl.register)
router.put(
  '',
  middlewares.stripToken,
  middlewares.verifyToken,
  UserCtrl.UpdatePassword
)

router.put(
  '/profile',
  middlewares.stripToken,
  middlewares.verifyToken,
  UserCtrl.updateProfile
)
router.get(
  '/profile/:id',
  middlewares.stripToken,
  middlewares.verifyToken,
  UserCtrl.getResById
)
router.get(
  '/profile',
  middlewares.stripToken,
  middlewares.verifyToken,
  UserCtrl.getProfileById
)
router.put(
  '/profile',
  middlewares.stripToken,
  middlewares.verifyToken,
  UserCtrl.updateProfile
)
router.delete(
  '',
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