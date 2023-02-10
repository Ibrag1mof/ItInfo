const Joi = require("joi")

exports.desctopicValidation = (data) =>{
    const schema = Joi.object({
        desc_id:Joi.string()
        .required(),
        topic_id:Joi.string()
        .required()
    })     

    
    return schema.validate(data)

}

