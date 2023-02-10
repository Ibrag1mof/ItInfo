const Joi = require("joi")

exports.authorSocialValidation = (data) =>{
    const schema = Joi.object({
        author_id:  Joi.string(),
        social_id:  Joi.string(),
        social_link:Joi.string()
        .required()
    })
    return schema.validate(data)
}