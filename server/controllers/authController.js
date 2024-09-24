const userModel = require("../models/userModels");
const oAuthUserModel = require("../models/oauthModel");

var bcrypt   = require('bcryptjs');
const jwt = require('jsonwebtoken');
const oauthModel = require("../models/oauthModel");
//saare api functions  ko later  routes mein yaha se export hogaye hai, aur model use ho raha  hai
const registerController = async (req, res) => {
  if(req.body.type){
    const existingUser = await oAuthUserModel.findOne({ "user.email ": req.body.user.email });
    if(existingUser){
      return res.status(200).send({
        success: false,
        message: "User ALready exists",
      });
    }
    else{
      const user = new oAuthUserModel(req.body);
      await user.save();
      return res.status(201).send({
        success: true,
        message: "User Registerd Successfully",
        user,
      });
    }

  }
  try {
    const exisitingUser = await userModel.findOne({ email: req.body.email });
    //validation
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "User ALready exists",
      });
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
    //rest data
    const user = new userModel(req.body);
    await user.save();
    return res.status(201).send({
      success: true,
      message: "User Registerd Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Register API",
      error,
    });
  }
};

//login call back
const loginController = async (req, res) => {
  if(req.body.type){
    try{
      const user = await oAuthUserModel.findOne({ "user.email": req.body.user.email });
      console.log(user);
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "Invalid Credentials",
        });
      }
      const token = jwt.sign({ userId: user._id, data : user, role : "user" }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      const response = {
        success : true,
        message : "Login Successfully",
        token : token,
        user : user
      }
      console.log(response)
      return res.status(200).send(response);
    }
    catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error In Login API",
        error,
      });
  }
}
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid Credentials",
      });
    }
    //check role
    if (user.role !== req.body.role) {
      return res.status(500).send({
        success: false,
        message: "role dosent match",
      });
    }
    //compare password
    const comparePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!comparePassword) {
      return res.status(500).send({
        success: false,
        message: "Invalid Credentials",
      });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.status(200).send({
      success: true,
      message: "Login Successfully",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Login API",
      error,
    });
  }
};

//GET CURRENT USER
const currentUserController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
 
    return res.status(200).send({
      success: true,
      message: "User Fetched Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "unable to get current user",
      error,
    });
  }
};

module.exports = { registerController, loginController, currentUserController };