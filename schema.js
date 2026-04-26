const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    title: Joi.string()
        .max(30)
        .required(),

    price: Joi.number()
        .min(0)
        .required(),

    description: Joi.string()
        .max(300)
        .required(),
    location: Joi.string()
        .required(),
    country: Joi.string()
        .required(),
    image: Joi.string()
        .uri()
        .allow("",null),
})
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});
