import { Schema, model } from "mongoose";
import Joi from "joi";

import { handleSaveError } from "./hooks.js";

const phoneRegexp = /^\(\d{3}\) \d{3}-\d{4}$/; // (123) 123-1234


const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
        match: phoneRegexp,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
});

contactSchema.post("save", handleSaveError); // хук на ерор для сервера
     
export const contactAddSchema = Joi.object({
    name: Joi.string().required().messages({
        "any.required": `"name" must be exist`,
        "string.base": `"name" must be string`
    }),
    email: Joi.string().required().messages({
        "any.required": `"email" must be exist`,
        "string.base": `"email" must be string`
    }),
    phone: Joi.string().regex(phoneRegexp).required().messages({
        "any.required": `"phone" must be exist`,
        "string.base": `"phone" must be number. Example <(123) 123-1234>`,
        "string.pattern.base": `"phone" not be valid. Example valid <(123) 123-1234>`
    }),
    favorite: Joi.boolean(),
})

export const contactUpdateSchema = Joi.object({
    name: Joi.string().messages({
        "string.base": `"name" must be string`
    }),
    email: Joi.string().messages({
        "string.base": `"email" must be string`
    }),
    phone: Joi.string().regex(phoneRegexp).messages({
        "string.base": `"phone" must be number. Example <(123) 123-1234>`,
        "string.pattern.base": `"phone" not be valid. Example valid <(123) 123-1234>`
    }),
    favorite: Joi.boolean(),
})

const Contact = model("contact", contactSchema);

export default Contact;