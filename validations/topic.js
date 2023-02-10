const Joi = require("joi")

exports.topicValidation = (data) =>{
    const schema = Joi.object({
        author_id:Joi.string()
        .required(),
        topic_title:Joi.string()
        .required(),
        topic_text:Joi.string()
        .required(),
        is_checked:Joi.boolean()
        .required(),
        id_approved:Joi.boolean(),
        expert_id:Joi.string()
        .required()
    })

    return schema.validate(data)
}