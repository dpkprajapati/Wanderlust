const Joi = require("joi")
 
module.exports.listingSchema=Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required(),
        image:Joi.string().allow("",null),
})

module.exports.reviewSchema = Joi.object({
        rating:Joi.number().required(),
        comment: Joi.string().trim().min(5).required().messages({
        "string.min": "Comment must be at least 5 characters long"
        })

})


