const Joi = require("joi")

exports.questionaValidation = (data) =>{
    const schema = Joi.object({
        question:Joi.string()
        .required(),
        answer:Joi.string()
        .required(),
        is_checked:Joi.boolean()
        .required(),
        expert_id:Joi.string()
    })

    return schema.validate(data)
}