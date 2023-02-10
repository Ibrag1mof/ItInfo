const User = require("../models/User");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("../services/JwtService");
const config = require("config");

const { userValidation } = require("../validations/user");

const errorHandler = (res, error) => {
  res.status(500).send({ message: `Xatolik : ${error}` });
};
const uuid = require("uuid");
const mailService = require("../services/MailService");

const addUser = async (req, res) => {
  try {
    const { error, value } = userValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const {
      user_name,
      user_email,
      user_password,
      user_info,
      user_photo,
      user_reg_date,
    } = value;
    const userHashedPassword = bcrypt.hashSync(user_password, 7);

    const user_activation_link = uuid.v4();

    const data = await User({
      user_name,
      user_email,
      user_password: userHashedPassword,
      user_info,
      user_photo,
      user_reg_date,
      user_activation_link,
    });
    await data.save();
    await mailService.sendActivationMail(
      user_email,
      `${config.get("api_url")}/api/user/activate/${user_activation_link}`
    );
    const payload = {
      id: data._id,
      user_is_active: data.user_is_active,
    };
    const tokens = jwt.generateTokens(payload);
    data.user_token = tokens.refreshToken;
    await data.save();
    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
      httpOnly: true,
    });
    res.status(200).send("user is added");
  } catch (error) {
    errorHandler(res, error);
  }
};

const getUsers = async (req, res) => {
  try {
    const data = await User.find({});
    if (!data.length) return res.status(404).send("Information not found");
    res.status(200).send(data);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const idData = await User.findById(id);
    if (!idData) return res.status(400).send("Information is not found");
    res.status(200).send(idData);
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const idData = await User.findById(id);
    if (!idData) return res.status(400).send("Information was not found");
    const { error, value } = userValidation(req.body);
    if (error) {
      return res.status(404).send({ message: error.details[0].message });
    }
    const {
      user_name,
      user_email,
      user_password,
      user_info,
      user_photo,
      user_reg_date,
    } = value;
    const userHashedPassword = bcrypt.hashSync(user_password, 7);
    const data = await User.findByIdAndUpdate(
      { _id: id },
      {
        user_name,
        user_email,
        user_password: userHashedPassword,
        user_info,
        user_photo,
        user_reg_date,
      }
    );
    res.status(200).send("OK.Info was updated");
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const idData = await User.findById(id);
    if (!idData) return res.status(400).send("Information was not found");
    await User.findByIdAndDelete(id);
    res.status(200).send("Ok. userInfo is deleted");
  } catch (error) {
    errorHandler(res, error);
  }
};

const emailValidation = (email) => {
  const q = Joi.string().email().validate(email);
  if (q.error) {
    console.log(q.error);
    return false;
  }
  return true;
};

const userActivate = async (req, res) => {
  try {
    const user = await User.findOne({ user_activation_link: req.params.link });
    if (!user) {
      return res.error(400, { friendlyMsg: "User topilmadi" });
    }
    if (user_is_active) {
      return res.error(400, { friendlyMsg: "User already activated" });
    }

    user.user_is_active = true;

    await user.save();
    res.ok(200, "user activated");
  } catch (error) {
    errorHandler(res, error);
  }
};

const loginUser = async (req, res) => {
  let user;
  const { login, user_password } = req.body;
  if (emailValidation(login)) user = await User.findOne({ user_email: login });
  else user = await User.findOne({ user_name: login });
  if (!user) return res.status(404).send("Malumotlarr notogri");
  const validPassword = bcrypt.compareSync(user_password, user.user_password);
  if (!validPassword) return res.status(400).send("Malumotlar notogri");
  const payload = {
    id: user.id,
  };
  const tokens = jwt.generateTokens(payload);
  user.user_token = tokens.refreshToken;
  await user.save();
  res.cookie("refreshToken", tokens.refreshToken, {
    maxAge: config.get("refresh_ms"),
    httpOnly: true,
  });
  res.ok(200, tokens);
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    let user;
    if (!refreshToken)
      return res.error(400, { friendlyMsg: "Token is not found" });
    user = await User.findOneAndUpdate(
      { user_token: refreshToken },
      { user_token: "" },
      { new: true }
    );
    if (!user) return res.error(400, { friendlyMsg: "Token topilmadi" });
    res.clearCookie("refreshToken");
    res.ok(200, user);
  } catch (error) {
    errorHandler(res, error);
  }
};

const refreshUserToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
      return res.error(400, { friendlyMsg: "Token is not found" });
    const adminDataFromCookie = await jwt.verifyRefresh(refreshToken);
    const adminDataFromDb = await User.findOne({ admin_token: refreshToken });
    if (!adminDataFromCookie || !adminDataFromDb) {
      return res.error(400, { friendlyMsg: "Admin is not registered" });
    }
    const user = await User.findById(adminDataFromCookie.id);
    if (!user) return res.error(400, { friendlyMsg: "ID is incorrect" });
    const payload = {
      id: user.id,
    };
    const tokens = jwt.generateTokens(payload);
    user.user_token = tokens.refreshToken;
    await user.save();
    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
      httpOnly: true,
    });
    res.ok(200, tokens);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  getUser,
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  loginUser,
  logout,
  refreshUserToken,
  userActivate,
};
