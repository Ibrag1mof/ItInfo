const Author = require("../models/Author");
const bcrypt = require("bcrypt");
const jwt = require("../services/JwtService");
const config = require("config");
const Joi = require("joi");
const { authorValidation } = require("../validations/author");

const errorHandler = (res, error) => {
  res.status(500).send({ message: `Xatolik : ${error}` });
};

const generateAccesToken = (id, is_expert, authorRoles) => {
  const payload = {
    id,
    is_expert,
    authorRoles,
  };
  return jwt.sign(payload, config.get("secret"), { expiresIn: "8h" });
};

const addAuthor = async (req, res) => {
  try {
    const { error, value } = authorValidation(req.body);
    if (error) {
      console.log(error);
      return res.error(400, { message: error.details[0].message });
    }
    console.log(value);
    const {
      author_first_name,
      author_last_name,
      author_nick_name,
      author_email,
      author_phone,
      author_password,
      author_info,
      author_position,
      author_photo,
      is_expert,
    } = value;
    const check2 = await Author.findOne({ author_nick_name });
    if (check2 != null)
      return res.error(400, "Information has already been added");
    const authorHashedPassword = bcrypt.hashSync(author_password, 7);
    const data = await Author({
      author_first_name,
      author_last_name,
      author_nick_name,
      author_email,
      author_phone,
      author_password: authorHashedPassword,
      author_info,
      author_position,
      author_photo,
      is_expert,
    });
    await data.save();
    res.send("OK. Author is added");
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAuthor = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Author.findOne({ _id: id });
    if (data == null) return res.send("Id bo'yicha ma'lumot yo'q");
    res.send(data);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAuthors = async (req, res) => {
  try {
    const info = await Author.find({});
    if (info.length < 1) res.error(400, "Ma'lumot yo'q");
    res.send(info);
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateAuthor = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Author.findOne({ _id: id });
    if (result == null) res.error(400, "Id is incorrect");
    const { error, value } = authorValidation(req.body);
    if (error) {
      console.log(error);
      return res.error(400, { message: error.details[0].message });
    }
    const {
      author_first_name,
      author_last_name,
      author_nick_name,
      author_email,
      author_phone,
      author_password,
      author_info,
      author_position,
      author_photo,
      is_expert,
    } = value;
    const authorHashedPassword = bcrypt.hashSync(author_password, 7);
    console.log(authorHashedPassword);
    const data = await Author.findByIdAndUpdate(
      { _id: id },
      {
        author_first_name,
        author_last_name,
        author_nick_name,
        author_email,
        author_phone,
        author_password,
        author_info,
        author_position,
        author_photo,
        is_expert,
      }
    );
    await data.save();
    res.send("AuthorInfo is updated");
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Author.findOne({ _id: id });
    if (result == null) return res.error(400, { message: "Id is incorrect" });
    await Author.findByIdAndDelete(id);
    res.send({ message: "OK. Author is deleted" });
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
const loginAuthor = async (req, res) => {
  let author;
  const { login, author_password } = req.body;
  const phoneRegExp = /\d{2}-\d{3}-\d{2}-\d{2}/.test(login);
  if (phoneRegExp) author = await Author.findOne({ author_phone: login });
  else if (emailValidation(login))
    author = await Author.findOne({ author_email: login });
  else author = await Author.findOne({ author_nick_name: login });
  if (!author) return res.error(400, "Malumotlarr notogri");
  const validPassword = bcrypt.compareSync(
    author_password,
    author.author_password
  );
  if (!validPassword) return res.error(400, "Malumotlar notogri");
  const payload = {
    id: author.id,
    author_is_expert: author.author_is_expert,
  };
  const tokens = jwt.generateTokens(payload);
  author.author_token = tokens.refreshToken;
  await author.save();
  res.cookie("refreshToken", tokens.refreshToken, {
    maxAge: config.get("refresh_ms"),
    httpOnly: true,
  });
  res.ok(200, tokens);
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    let author;
    if (!refreshToken)
      return res.error(400, { friendlyMsg: "Token is not found" });
    author = await Author.findOneAndUpdate(
      { author_token: refreshToken },
      { author_token: "" },
      { new: true }
    );
    if (!author) return res.error(400, { friendlyMsg: "Token topilmadi" });
    res.clearCookie("refreshToken");
    res.ok(200, author);
  } catch (error) {
    errorHandler(res, error);
  }
};
const refreshAuthorToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
      return res.error(400, { friendlyMsg: "Token is not found" });
    const authorDataFromCookie = await jwt.verifyRefresh(refreshToken);
    const authorDataFromDb = await Author.findOne({
      Author_token: refreshToken,
    });
    if (!authorDataFromCookie || !authorDataFromDb) {
      return res.error(400, { friendlyMsg: "Author is not registered" });
    }
    const author = await Author.findById(authorDataFromCookie.id);
    if (!author) return res.error(400, { friendlyMsg: "ID is incorrect" });
    const payload = {
      id: author.id,
      author_is_expert: author.author_is_expert,
    };
    const tokens = jwt.generateTokens(payload);
    author.author_token = tokens.refreshToken;
    await Author.save();
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
  getAuthor,
  getAuthors,
  addAuthor,
  updateAuthor,
  deleteAuthor,
  loginAuthor,
  logout,
  refreshAuthorToken,
};
