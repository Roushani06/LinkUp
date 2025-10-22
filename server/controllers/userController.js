// in this userController.js file we will create controller function using which we can create user, allow users to login, we can authenticate user using JWT token and also can update user profile

import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// SignUp a new User

export const signUp = async(req, res)=>{
     const {fullName, email, password, bio} = req.body;
     try{
        if(!fullName || !email || !password || !bio){
            return res.status(400).json({success: false, message: "All fields are required"});
        }

        const user = await User.findOne({email});

        if(user){
            return res.status(400).json({success: false, message: "User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName, email, password: hashedPassword, bio
        });

        const token = generateToken(newUser._id)

        res.json({success: true, message: "User created successfully", userData: {
            newUser,
            token
        }});
     }catch(error){
        console.log(error.message);
        res,json({success: false, message: error.message});
         
     }
}


// Controller function to login user
export const login = async(req, res)=>{
    try{
    const {email, password} = req.body;

    const userData = await User.findOne({email})
     if (!userData) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }


    const isPasswordCorrect = await bcrypt.compare(password, userData.password);
  

        if(!isPasswordCorrect){
            return res.json({success: false, message: "Invalid credentials"});
        }

         const token = generateToken(userData._id)

        res.json({success: true, userData, token, message: "Logged in succesfully"});
        }
         catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message});

    }
}

//Controller to check if user is authenticated
export const checkAuth = (req, res)=>{
    res.json({success: true, user: req.user}); 
}

// Controller to update user profile
// they can update images also  for this we have to set up the cloudinary account so that we can upload images to cloudinary and store the image URL in our database

export const updateProfile = async(req, res)=>{
    try{
    const {fullName, bio, profilePic} = req.body;

    const userId = req.user._id;

    let updatedUser;
    if(!profilePic){
        updatedUser = await User.findByIdAndUpdate(userId, {fullName, bio}, {new: true});

    }else{
        const upload = await cloudinary.uploader.upload(profilePic);

        updatedUser = await User.findByIdAndUpdate(userId, {
            profilePic: upload.secure_url,
            bio,
            fullName
    }, {new: true});
    res.json({success: true, user: updatedUser});
}
    } catch (error){
        console.log(error.message)
     res.json({success: false, message: error.message});
    }
}


    

