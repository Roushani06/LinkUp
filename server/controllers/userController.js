// in this userController.js file we will create controller function using which we can create user, allow users to login, we can authenticate user using JWT token and also can update user profile

import { generateToken } from "../lib/utils";
import User from "../models/User";
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
    const {email, password} = req.body;

    const userData = await User.findOne({email})

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);
    try{

        if(!isPasswordCorrect){
            return res.json({success: false, message: "Invalid credentials"});
        }

         const token = generateToken(newUser._id)

        res.json({success: true, message: "Logged in succesfully", userData: {
           userData,
            token
        }});
        }
         catch(error){
        console.log(error.message);
        res,json({success: false, message: error.message});

    }
}

