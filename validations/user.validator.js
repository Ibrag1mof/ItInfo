const Joi = require("joi");

const userSchema = Joi.object({
  user_name: Joi.string().required(),
  user_email: Joi.string().required(),
  user_password: Joi.string().min(5).max(30).required(),
  user_info: Joi.string().default("New user"),
  user_photo: Joi.string().default("/image/default.jpg/"),
});

module.exports = userSchema;
