const AuthorSocial = require("../models/Author_Social");
const Author = require("../models/Author");
const Social = require("../models/Social");

const { authorSocialValidation } = require("../validations/authorSocial");

const errorHandler = async (res, error) => {
  res.status(500).send({ message: `Xatolik:${error}` });
};

const addAuthorSocial = async (req, res) => {
  try {
    const { error, value } = authorSocialValidation(req.body);
    if (error) {
      return res.error(400, { message: error.details[0].message });
    }
    const { author_id, social_id, social_link } = value;
    let check = await Author.findOne({ _id: author_id });
    console.log(check);
    let check2 = await Social.findOne({ _id: social_id });
    console.log(check2);
    if (check == null)
      return res.error(400, { message: "Author_id xato berilgan" });
    if (check2 == null)
      return res.error(400, { message: "Social_id xato berilgan" });
    const data = await AuthorSocial({ author_id, social_id, social_link });
    await data.save();
    res.ok(200, "Ok. Author social is added");
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAuthorSocials = async (req, res) => {
  try {
    const info = await AuthorSocial.find({});
    if (info < 1) return res.error(400, { message: "Ma'lumot topilmadi" });
    res.send(info);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAuthorSocial = async (req, res) => {
  try {
    const id = req.params.id;
    let data = await AuthorSocial.findOne({ _id: id });
    console.log(data);
    if (data == null)
      return res.error(400, { message: "Id bo'yicha ma'lumot topilmadi" });
    const info = await AuthorSocial.findById(id);
    res.ok(200, info);
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateAuthorSocial = async (req, res) => {
  try {
    const id = req.params.id;
    const { error, value } = authorSocialValidation(req.body);
    if (error) {
      return res.error(400, { message: error.details[0].message });
    }
    const { author_id, social_id, social_link } = value;
    const idData = await AuthorSocial.findById(id);
    if (idData == null)
      return res.error(400, { message: "Id bo'yicha ma'lumot yo'q" });
    await AuthorSocial.findByIdAndUpdate(
      { _id: id },
      { author_id, social_id, social_link }
    );
    res.ok(200, { message: "User is updated.ok" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteAuthorSocial = async (req, res) => {
  try {
    const id = req.params.id;
    const idData = await AuthorSocial.findOne({ _id: id });
    if (idData == null)
      return res.error(400, { message: "Id bo'yicha ma'lumot yo'q" });
    await AuthorSocial.findByIdAndDelete(id);
    res.ok(200, { message: "OK. AuthorSocialInfo is deleted" });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addAuthorSocial,
  getAuthorSocial,
  getAuthorSocials,
  updateAuthorSocial,
  deleteAuthorSocial,
};
