const router = require('express').Router
const UserCtrl = require('../controllers/userController')
const middlewares = require('../middlewares')

router.post('/login', UserCtrl.login)
router.post('/register', UserCtrl.register)
router.put(
  '',
  middleWares.stripToken,
  middleWares.verifyToken,
  UserCtrl.UpdatePassword
)

router.put(
  '/profile',
  middleWares.stripToken,
  middleWares.verifyToken,
  UserCtrl.updateProfile
)
router.get(
  '/profile/:id',
  middleWares.stripToken,
  middleWares.verifyToken,
  UserCtrl.getResById
)
router.get(
  '/profile',
  middleWares.stripToken,
  middleWares.verifyToken,
  UserCtrl.getProfileById
)
router.put(
  '/profile',
  middleWares.stripToken,
  middleWares.verifyToken,
  UserCtrl.updateProfile
)
router.delete(
  '',
  middleWares.stripToken,
  middleWares.verifyToken,
  UserCtrl.deleteProfile
)
router.get(
  '/session',
  middleWares.stripToken,
  middleWares.verifyToken,
  middleWares.CheckSession
)

module.exports = router