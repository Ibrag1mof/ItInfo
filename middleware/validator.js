const Validator = require("../validations/index");

module.exports = function (validator) {
  if (!Validator.hasOwnProperty(validator))
    throw new Error(`'${validator}' validator is not exist`);

  return async function (req, res, next) {
    try {
      const validated = await Validator[validator].validateAsync(req.body);
      req.body = validated;
      next();
    } catch (err) {
      if (err.isJoi) {
        return res.error(400, {
          message: err.message,
          friendlyMsg: "Validation error",
        });
      }
      return res.error(500, {
        friendlyMsg: "Internal error",
      });
      // next()
    }
  };
};
