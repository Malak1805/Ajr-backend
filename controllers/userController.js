const User = require('../models/User')

// Show registration form
exports.showRegister = (req, res) => {
  res.render('auth/register')
}

// Register user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const user = new User({ name, email, password })
    await user.save()
    res.redirect('/login')
  } catch (error) {
    res.render('auth/register', { error: 'Registration failed' })
  }
}

// Show login form
exports.showLogin = (req, res) => {
  res.render('auth/login')
}

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user || !(await user.matchPassword(password))) {
      return res.render('auth/login', { error: 'Invalid credentials' })
    }

    req.session.user = user
    res.redirect('/dashboard')
  } catch (error) {
    res.render('auth/login', { error: 'Login failed' })
  }
}

// Logout
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login')
  })
}