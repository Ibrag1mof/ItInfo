const admin = require("./admin.validator");
const user = require("./user.validator");
const email_pass = require("./eamil_pass.validator");
const author = require("./author.validator");

module.exports = {
  admin,
  user,
  email_pass,
  author,
};
