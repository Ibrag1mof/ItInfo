const Joi = require("joi");

exports.userValidation = (data) => {
  const schema = Joi.object({
    user_name: Joi.string().required(),
    user_email: Joi.string().required(),
    user_password: Joi.string().min(5).max(30).required(),
    user_info: Joi.string().default("New user"),
    user_photo: Joi.string().default("/image/default.jpg/"),
    user_reg_date: Joi.string().default(new Date()),
  });
  return schema.validate(data);
};
