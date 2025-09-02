const User = require('../models/User')
const middleWares = require('../middlewares')

// Register a new user
exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, password, address, phone_number } = req.body
//return these fields to the user to fill
    

    let userInDB = await User.findOne({ email }); //if user enters a used email
    if (userInDB) {
      return res.status(400).send({ status: 'Error', msg: 'User with this email already exists' })
    }

    // Hash the password 
    const password_digest = await middleWares.hashPassword(password);

    // Create a new user with the hashed password and initialize login 
    const newUser = await User.create({
      first_name,
      last_name,
      email,
      password_digest,
      address,
      phone_number,
      failedLoginAttempts: 0, 
      lockUntil: undefined 
    })

    
    res.status(200).send(newUser);
  } catch (error) {
  
    console.error("Registration error:", error) //error message 
  
    res.status(500).send({ status: 'Error', msg: 'Registration failed' });
  }
};

// Log in a user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const userInDB = await User.findOne({ email }); //find user by email
    if (!userInDB) { //if not
      return res.status(401).send({ status: 'Error', msg: 'Unauthorized: Invalid credentials' });
    }

    // check if the account is temporarily locked
    if (userInDB.lockUntil && userInDB.lockUntil > Date.now()) {
      return res.status(423).send({
        status: 'Error',
        msg: 'Account temporarily locked due to too many failed attempts. Try again later.'
      })
    }

    const matched = await middleWares.comparePassword( //storing the hashed pass
      password,
      userInDB.password_digest
    )
// reset and save
    if (matched) {
      userInDB.failedLoginAttempts = 0
      userInDB.lockUntil = undefined
      await userInDB.save()

//payload
      let payload = {
        id: userInDB._id,
        email: userInDB.email,
        name: userInDB.first_name 
      };

      let token = middleWares.createToken(payload)
      return res.status(200).send({ user: payload, token })
    }

  
    userInDB.failedLoginAttempts = (userInDB.failedLoginAttempts || 0) + 1;

  
    const MAX_FAILED_ATTEMPTS = 5;
    const LOCK_DURATION_MS = 10 * 60 * 1000; 
    if (userInDB.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) { //set lock for 10 min if failure to 5
      userInDB.lockUntil = Date.now() + LOCK_DURATION_MS;
    }
    await userInDB.save();

    // Send an unauthorized error for invalid credentials
    res.status(401).send({ status: 'Error', msg: 'Unauthorized: Invalid credentials' });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({ status: 'Error', msg: 'Login failed' });
  }
};

// Logout a user for JWT authentication
exports.logout = (req, res) => {
 
  res.status(200).send({ status: 'Success', msg: 'Logged out successfully (client should discard token).' })
}

// get user profile by Id
exports.getProfileById = async (req, res) => {
  try {
    const { id } = res.locals.payload
    const profile = await User.findById(id)

    if (!profile) {
      return res.status(404).send({ msg: 'User not found' })
    }
    res.status(200).send(profile)
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).send({ status: 'Error', msg: 'Failed to retrieve profile' })
  }
};

// Update a user's profile
exports.updateProfile = async (req, res) => {
  try {
    
    const { id } = res.locals.payload;
    const updatedProfile = await User.findByIdAndUpdate(id, req.body, {
      new: true, 
      runValidators: true 
    });

    if (!updatedProfile) {
      return res.status(404).send({ msg: 'User not found' });
    }

    res.status(200).send({ msg: 'User profile updated', updatedProfile });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).send({ status: 'Error', msg: 'Failed to update profile' });
  }
};

// Delete a user's profile
exports.deleteProfile = async (req, res) => {
  try {
    
    const { id } = res.locals.payload;
    const deleted = await User.findByIdAndDelete(id);

    if (deleted) {
      return res.status(200).send({ msg: 'User profile deleted', deleted });
    }
    return res.status(404).send({ msg: 'User not found' });
  } catch (error) {
    console.error("Delete profile error:", error);
    res.status(500).send({ status: 'Error', msg: 'Failed to delete profile' });
  }
};

// Update a user's password
exports.updatePassword = async (req, res) => {
  try {
   
    const { id } = res.locals.payload;
    let userInDB = await User.findById(id);

    if (!userInDB) { //if the user not in the database
      return res.status(404).send({ status: 'error', msg: 'User not found' });
    }

    // Validate that old and new passwords are provided
    if (!req.body.old_password || !req.body.new_password) {
      return res
        .status(400)
        .send({ status: 'error', msg: 'Old and new passwords are required' });
    }

    // Compare the old password with the stored hashed password
    const matched = await middleWares.comparePassword(
      req.body.old_password,
      userInDB.password_digest
    );

    if (matched) {
      const password_digest = await middleWares.hashPassword(
        req.body.new_password
      );
      userInDB = await User.findByIdAndUpdate(
        id,
        { password_digest: password_digest },
        { new: true } // Return the updated document
      );

      // Create a payload for a new JWT 
      const payload = {
        id: userInDB._id,
        email: userInDB.email,
        name: userInDB.first_name
      };
      return res
        .status(200)
        .send({ status: 'Password updated successfully', user: payload });
    }

    // If the old password does not match
    res.status(401).send({ status: 'error', msg: 'Update password failed: Invalid old password' });
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).send({ status: 'Error', msg: 'Failed to update password' });
  };
};
