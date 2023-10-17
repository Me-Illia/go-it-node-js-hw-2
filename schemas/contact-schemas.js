import Joi from "joi";

export const contactAddSchema = Joi.object({
    name: Joi.string().required().messages({
        "any.required": `"name" must be exist`,
        "string.base": `"name" must be string`
    }),
    email: Joi.string().required().messages({
        "any.required": `"email" must be exist`,
        "string.base": `"email" must be string`
    }),
    phone: Joi.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/).required().messages({
        "any.required": `"phone" must be exist`,
        "number.base": `"phone" must be number`
    }),
})

export const contactUpdateSchema = Joi.object({
    name: Joi.string().messages({
        "string.base": `"name" must be string`
    }),
    email: Joi.string().messages({
        "string.base": `"email" must be string`
    }),
    phone: Joi.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/).messages({
        "number.base": `"phone" must be number`
    }),
})