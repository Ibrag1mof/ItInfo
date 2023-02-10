const Joi = require("joi")  


exports.categoryValidation = (data) => {
    const schema = Joi.object({
        category_name: Joi.string()
        .min(2)
        .max(255)
        .required(),
        parent_category_id:Joi.string()
})
    return schema.validate(data)
}