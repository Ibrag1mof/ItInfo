const { string } = require("joi");
const { stubFalse } = require("lodash");
const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    user_name: {
      type: String,
      required: true,
      trim: true,
    },
    user_email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    user_password: {
      type: String,
      required: true,
    },
    user_info: {
      type: String,
    },

    user_photo: {
      type: String,
    },
    user_is_active: {
      type: Boolean,
      default: false,
    },
    user_activation_link: {
      type: String,
    },
    user_token: {
      type: String,
    },
  },

  { versionKey: false, timestamps: true }
);

module.exports = model("User", userSchema);
