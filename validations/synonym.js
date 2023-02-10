const Joi = require("joi")

exports.synonymValidation = (data) =>{
    const schema = Joi.object({
        desc_id:Joi.string(),
        dict_id:Joi.string()
    })

    return schema.validate(data)
}