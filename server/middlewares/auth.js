// middleware is the function that will executed before executing the contoller functions.
//using this middleware we can protect certain routes that can be accessed by authenticated users only.

import jwt from "jsonwebtoken";
import User from "../models/User";

//Middleware to protect routes
export const protectRoute = async (req, res, next)=>{
    try{
    //get token from headers
    const token = req.headers.token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if(!user)
return res.json({success: false, message: "Uer not found"});

//if user is found
    req.user = user; // it will add the user data to the request object and we can access this user data in the controller functions
    next(); // it will call the next middleware or controller function

    }catch(error){
        console.log(error.message)
        res.json({success: false, message: error.message});
    }
}

