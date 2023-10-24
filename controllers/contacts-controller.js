import Contact from "../models/contacts.js";

import { HttpError } from "../helpers/index.js";

import { contactAddSchema, contactUpdateSchema } from "../models/contacts.js";

import {ctrlWrapper} from "../decorators/index.js"

const getAll = async (req, res, next) => {
        const result = await Contact.find(); // отримуємо список контактів вже з мангуса
        res.json(result);
}

// const getById = async (req, res) => {
//         const { id } = req.params; // беремо марштур з Ід
//         const result = await contactService.getContactById(id); // робимо запит з фільму
//         if (!result) {
//             // ствоюємо помилку з статусом, а не відповідаємо помилкою
//             throw HttpError(404); 
//         }
//         res.json(result); // повертаємо відповідь
// }

const add = async (req, res) => {
        const { error } = contactAddSchema.validate(req.body);
        if (error) {
            throw HttpError(400, error.message);
        }
        const result = await Contact.create(req.body); // створюєио вже в мангусі
            res.status(201).json(result);
}

// const updateById = async (req, res) => {
//         const { error } = contactUpdateSchema.validate(req.body);
//         if (error) {
//             throw HttpError(400, error.message);
//         }
//         const { id } = req.params;
//         const result = await contactService.updateContactById(id, req.body);
//         if (!result) {
//             throw HttpError(404, error.message);
//         }
        
//         res.json(result);
// }

// const deleteById = async (req, res) => {
//         const { id } = req.params;
//         const result = await contactService.removeContact(id)
//         if (!result) {
//             throw HttpError(404, error.message)
//         }

//         res.json({
//             message: "contact deleted"
//         })
// }

export default {
    getAll: ctrlWrapper(getAll),
    // getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    // updateById: ctrlWrapper(updateById),
    // deleteById: ctrlWrapper(deleteById),
}