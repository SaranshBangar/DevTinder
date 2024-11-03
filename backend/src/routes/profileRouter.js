const express = require('express');
const profileRouter = express.Router();

const User = require('../models/user');

const bcrypt = require('bcrypt');

const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData } = require('../utils/validation');

// API to fetch a profile
profileRouter.get("/", userAuth, async (req, res) => {

    try {
        const user = req.user;
        res.status(200).json({
          message : "Profile fetched successfully",
          data : user
        });
    }
    catch (err) {
        res.status(400).send("Something went wrong");
    }
});

// API to update a profile
profileRouter.patch("/update", userAuth, async (req, res) => {
  console.log('Update request received:', {
      userId: req.user._id,
      updateData: req.body
  });

  try {
      const validation = validateEditProfileData(req);
      console.log('Validation result:', validation);

      if (!validation.isValid) {
          return res.status(400).json({
              success: false,
              error: validation.error
          });
      }

      const updatedUser = await User.findByIdAndUpdate(
          req.user._id,
          req.body,
          {
              new: true,
              runValidators: true
          }
      );

      console.log('Updated user data:', updatedUser);

      if (!updatedUser) {
          return res.status(404).json({
              success: false,
              error: "User not found"
          });
      }

      // Return success response
      return res.status(200).json({
          success: true,
          message: "Profile updated successfully",
          data: {
              user: {
                  firstName: updatedUser.firstName,
                  lastName: updatedUser.lastName,
                  about: updatedUser.about,
                  skills: updatedUser.skills,
                  photoUrl: updatedUser.photoUrl,
                  birthDate : updatedUser.birthDate,
                  age: updatedUser.age,
                  gender: updatedUser.gender,
                  location: updatedUser.location,
                  occupation: updatedUser.occupation
              }
          }
      });

  } catch (err) {
      console.error('Error in update:', {
          name: err.name,
          message: err.message,
          stack: err.stack
      });

      // Check for specific error types
      if (err.name === 'ValidationError') {
          return res.status(400).json({
              success: false,
              error: Object.values(err.errors).map(e => e.message).join(', ')
          });
      }

      if (err.name === 'CastError') {
          return res.status(400).json({
              success: false,
              error: 'Invalid data format'
          });
      }

      // Send proper error response
      return res.status(500).json({
          success: false,
          error: "Internal server error",
          message: err.message
      });
  }
});

// API to edit a password
profileRouter.patch("/password", userAuth, async (req, res) => {

    try {
        const loggedinUser = req.user;

        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).send("Invalid fields");
        }

        const isOldPasswordValid = await loggedinUser.verifyPassword(oldPassword);

        if (isOldPasswordValid) {
            const hashPassword = await bcrypt.hash(newPassword, 5);

            loggedinUser.password = hashPassword;

            await loggedinUser.save();

            res.json({
                message : "Password updated successfully",
                data : loggedinUser
            })
        }
        else {
            res.status(400).send("Invalid password");
        };
    }
    catch (err) {
        res.status(400).send("Something went wrong");
    }
})

module.exports = profileRouter;