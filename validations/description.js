const Joi = require("joi")

exports.descriptionValidation = (data) =>{
    const schema = Joi.object({
        dict_id:Joi.string()
        .length(24),
        category_id:Joi.string()
        .length(24),
        description:Joi.string()
        .required()
    })

    return schema.validate(data)
}