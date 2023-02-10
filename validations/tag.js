const Joi = require("joi")

exports.tagValidation = (data) =>{
    const schema = Joi.object({
        topic_id:Joi.string()
        .required(),
        category_id:Joi.string()
        .required()
    })

    return schema.validate(data)
}