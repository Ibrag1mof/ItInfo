const Joi  = require("joi")

exports.socialValidation = (data) =>{
    const schema = Joi.object({
        social_name:Joi.string()
        .required(),
        social_icon_file:Joi.string()
        .required()
    })

    return schema.validate(data)
}