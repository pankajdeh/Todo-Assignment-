const { response } = require('express');
const User = require('../Model/user');
const jwt = require("jsonwebtoken")
require("dotenv").config()

// Create a new user
exports.createUser = async (req, res) => {
    try {
        const { phone_number, priority } = req.body;
        console.log("phone: ",phone_number)
        const user = await User.create({
            phone_number, priority
          })
          
    return res.status(200).json({
        success: true,
        user,
        message: "User registered successfully",
      })

    } catch (error) {
       console.log("error while creating user",error)
    }
};

exports.login = async(req,res)=>{
    try{

      const {phone_number}= req.body 
        console.log("num1: ")

        if (!phone_number) {
            // Return 400 Bad Request status code with error message
            return res.status(400).json({
              success: false,
              message: `Please Fill up All the Required Fields`,
            })
          }
          console.log("num: ",phone_number)
          const user = await User.findOne({ phone_number })

    // If user not found with provided email
    if (!user) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is not Registered with Us Please SignUp to Continue`,
      })
    }


        const token = jwt.sign(
            {  id: user._id },
            process.env.JWT_SECRET,
            {
              expiresIn: "24h",
            }
          )
    
          // Save token to user document in database
          user.token = token
          
          // Set cookie for token and return success response
          const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
          }
       return   res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            user,
            message: `User Login Success`,
          })

    }
    catch (error){
        console.log("login: ", error)
    }
}
// // Get all users
// const getAllUsers = async (req, res) => {
//     try {
//         const users = await User.find();
//         res.status(200).json(users);
//     } catch (error) {
//         handleError(res, error);
//     }
// };

// // Get user by ID
// const getUserById = async (req, res) => {
//     try {
//         const userId = req.params.id;
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         res.status(200).json(user);
//     } catch (error) {
//         handleError(res, error);
//     }
// };

// // Update user by ID
// const updateUserById = async (req, res) => {
//     try {
//         const userId = req.params.id;
//         const { phone_number, priority } = req.body;
//         const updatedUser = await User.findByIdAndUpdate(userId, { phone_number, priority }, { new: true });
//         if (!updatedUser) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         res.status(200).json(updatedUser);
//     } catch (error) {
//         handleError(res, error);
//     }
// };

// // Delete user by ID (soft deletion)
// const deleteUserById = async (req, res) => {
//     try {
//         const userId = req.params.id;
//         const deletedUser = await User.findByIdAndUpdate(userId, { deleted_at: Date.now() });
//         if (!deletedUser) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         res.status(200).json({ message: 'User deleted successfully' });
//     } catch (error) {
//         handleError(res, error);
//     }
// };

// module.exports = createUser

    // getAllUsers,
    // getUserById,
    // updateUserById,
    // deleteUserById

