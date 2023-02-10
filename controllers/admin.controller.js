const Admin = require("../models/Admin");

const { adminValidation } = require("../validations/admin");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("../services/JwtService");
const config = require("config");

const errorHandler = (res, error) => {
  res.status(500).send({ message: `Xatolik : ${error}` });
};

const addAdmin = async (req, res) => {
  try {
    const { error, value } = adminValidation(req.body);
    if (error) {
      return res.error(400, { message: error.details[0].message });
    }
    const {
      admin_name,
      admin_email,
      admin_password,
      admin_is_active,
      admin_is_creator,
    } = value;
    const adminHashedPassword = bcrypt.hashSync(admin_password, 7);
    const data = await Admin({
      admin_name,
      admin_email,
      admin_password: adminHashedPassword,
      admin_is_active,
      admin_is_creator,
    });
    await data.save();
    res.ok(200, "Admin is added");
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAdmins = async (req, res) => {
  try {
    const data = await Admin.find({});
    if (!data.length) return res.error(400, "Information not found");
    res.ok(200, data);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const idData = await Admin.findById(id);
    if (!idData) return res.error(400, { message: "Information not found" });
    res.ok(200, idData);
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const idData = await Admin.findById(id);
    if (!idData) return res.error(400, "Information was not found");
    const { error, value } = adminValidation(req.body);
    if (error) {
      return res.error(400, { message: error.details[0].message });
    }
    const {
      admin_name,
      admin_email,
      admin_password,
      admin_is_active,
      admin_is_creator,
      admin_reg_data,
    } = value;
    const adminHashedPassword = bcrypt.hashSync(admin_password, 7);
    await Admin.findByIdAndUpdate(
      { _id: id },
      {
        admin_name,
        admin_email,
        admin_password: adminHashedPassword,
        admin_is_active,
        admin_is_creator,
        admin_reg_data,
      }
    );
    res.ok(200, "OK.Info was updated");
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const idData = await Admin.findById(id);
    if (!idData) return res.error(400, "Information was not found");
    await Admin.findByIdAndDelete(id);
    res.ok(200, "Ok. AdminInfo is deleted");
  } catch (error) {
    errorHandler(res, error);
  }
};

const emailValidation = (email) => {
  const check = Joi.string().email().validate(email);
  if (check.error) {
    return false;
  }
  return true;
};

const loginAdmin = async (req, res) => {
  try {
    let admin;
    const { login, admin_password } = req.body;
    if (emailValidation(login))
      admin = await Admin.findOne({ admin_email: login });
    if (!admin)
      return res.error(400, { friendlyMsg: "Email1 or Password is incorrect" });
    const validPassword = bcrypt.compareSync(
      admin_password,
      admin.admin_password
    );
    if (!validPassword)
      return res.error(400, { friendlyMsg: "Email or Password incorrect" });
    const payload = {
      id: admin.id,
      admin_is_active: admin.admin_is_active,
      admin_is_creator: admin.admin_is_creator,
    };
    const tokens = jwt.generateTokens(payload);
    admin.admin_token = tokens.refreshToken;
    await admin.save();
    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
      httpOnly: true,
    });
    res.ok(200, tokens);
  } catch (error) {
    errorHandler(res, error);
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    let admin;
    if (!refreshToken)
      return res.error(400, { friendlyMsg: "Token is not found" });
    admin = await Admin.findOneAndUpdate(
      { admin_token: refreshToken },
      { admin_token: "" },
      { new: true }
    );
    if (!admin) return res.error(400, { friendlyMsg: "Token topilmadi" });
    res.clearCookie("refreshToken");
    res.ok(200, admin);
  } catch (error) {
    errorHandler(res, error);
  }
};

const refreshAdminToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
      return res.error(400, { friendlyMsg: "Token is not found" });
    const adminDataFromCookie = await jwt.verifyRefresh(refreshToken);
    const adminDataFromDb = await Admin.findOne({ admin_token: refreshToken });
    if (!adminDataFromCookie || !adminDataFromDb) {
      return res.error(400, { friendlyMsg: "Admin is not registered" });
    }
    const admin = await Admin.findById(adminDataFromCookie.id);
    if (!admin) return res.error(400, { friendlyMsg: "ID is incorrect" });
    const payload = {
      id: admin.id,
      admin_is_active: admin.admin_is_active,
      admin_is_creator: admin.admin_is_creator,
    };
    const tokens = jwt.generateTokens(payload);
    admin.admin_token = tokens.refreshToken;
    await admin.save();
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
  getAdmin,
  getAdmins,
  addAdmin,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
  logout,
  refreshAdminToken,
};
