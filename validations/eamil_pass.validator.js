const Joi = require("Joi");

const emailPassSchema = Joi.object({
  user_email: Joi.string().email().required(),
  user_password: Joi.string().min(5).max(30).required(),
});

module.exports = emailPassSchema;
