import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler (async (req,res) =>{
    const {email , username , password  } = req.body ;
        console.log("REGISTER BODY:", req.body);

    if(!email || !username || !password) throw new ApiError( 400 , "All fields are  required!!");

    const existedUser  = await User.findOne(
        {
            $or: [
                {email},
                {username}
            ]
        }
    );



    if(existedUser) throw new ApiError(409 , "user with this username or email already exists... ")

    const user = await User.create({
        email ,
        username :username.toLowerCase(), 
        password    
    });

    const createdUser = await User.findById(user._id)
    .select("-password -refreshToken")

    return res
    .status(201)
    .json(
        new ApiResponse(
            200 , 
            createdUser,
            "User created sucessfully."
        )
    );
})



const loginUser = asyncHandler (async (req,res) =>{
    const {email , username , password  } = req.body ;

    if(!email || !username && !password) throw new ApiError( 400 , "email/username and password are  required!!");

    const user  = await User.findOne(
        {
            $or: [
                {email},
                {username}
            ]
        }
    );

    if(!user) throw new ApiError(409 , "user with this username or email doesnt exists... ")

    const checkPassword = await user.isPasswordCorrect(password);

    if(!checkPassword) throw new ApiError(401 , "invalid password...  ")

   
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const fetchUser = await User.findById(user._id)
    .select("-password -refreshToken")


    const Options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .cookie("accessToken" , accessToken, Options)
    .cookie("refreshToken", refreshToken, Options)
    .json(
        new ApiResponse(
            200 , 
            {
                user : fetchUser,
                accessToken ,
                refreshToken
            },
            "User logged in  sucessfully."
        )
    );
})



const logoutUser = asyncHandler (async (req,res) =>{
    
    await User.findByIdAndUpdate(req.user._id ,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    );


    const Options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .cookie("accessToken" , Options)
    .cookie("refreshToken", Options)
    .json(
        new ApiResponse(
            200 , 
            {
            },
            "User logged out sucessfully."
        )
    );
})



const generateAccessAndRefreshTokens = async (userId , _) =>{
    try{
        const findUser = await User.findById(userId);

        const accessToken = findUser.generateAccessToken();
        const refreshToken = findUser.generateRefreshToken();

        //put the token inside user document ex: findUser{ .id : ... , email:... , refreshToken:....}
        findUser.refreshToken = refreshToken

        //save the updated document in db (validation is not needed we just saving the refresh token so turn it off )
        await findUser.save({validateBeforeSave: false })

        return {accessToken , refreshToken}
     }
      catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating refresh and access token"
        )
    }
}



const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken._id);

        if (!user) throw new ApiError(401, "Invalid refresh token");

        if (incomingRefreshToken !== user.refreshToken) throw new ApiError(401, "Refresh token is expired or used");

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        const options = {
            httpOnly: true,
            secure: true
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken },
                    "Access token refreshed"
                )
            );

    } catch (error) {
        throw new ApiError(
            401,
            error?.message || "Invalid refresh token"
        );
    }
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, req.user, "Current user fetched successfully")
    );
});

export { registerUser, loginUser, logoutUser, refreshAccessToken, getCurrentUser };

