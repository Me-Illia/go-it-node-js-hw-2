import Contact from "../models/contacts.js";

import { HttpError } from "../helpers/index.js";

import { contactAddSchema, contactUpdateSchema } from "../models/contacts.js";


const getAll = async (req, res, next) => { // + next параметр для оптимізації catch (error)
    try {
        const result = await Contact.find(); // отримуємо список контактів вже з мангуса
        res.json(result);
    } catch (error) {
        next(error);
    }
}

// const getById = async (req, res, next) => {
//     try {
//         //console.log(req.params); // req.params містить всі динамічні частини (':' - ключ 'res' - значення)
//         const { id } = req.params; // беремо марштур з Ід
//         const result = await contactService.getContactById(id); // робимо запит з фільму
//         if (!result) {
//             // ствоюємо помилку з статусом, а не відповідаємо помилкою
//             throw HttpError(404); 
            
//             // функціїї які повторюються в контролерах називаються — хелперси
//             // const error = new Error(`Contact with id=${id} not found`);
//             // error.status = 404;
//             // throw error; // переривається і переходить в catch

//         // однотипні речі робляться в одному місці, тому потрібно в кетч помилку
//         //    return res.status(404).json({
//         //         message: `Contact with id=${id} not found`
//         //     })
//         }
//         res.json(result); // повертаємо відповідь
//     } catch (error) {
//         next(error); // правило express (оптимізація)

//         // // відправляємо будь яку помилку зі статусом
//         // const { status = 500, message } = error;
//         // res.status(status).json({
//         //     message,
//         // })
//         // // res.status(500).json({
//         // //     message: error.message
//         // // })
//     }
// }

const add = async (req, res, next) => {
    try {
        const { error } = contactAddSchema.validate(req.body);
        if (error) {
            throw HttpError(400, error.message);
        }
        const result = await Contact.create(req.body); // створюєио вже в мангусі
            res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

// const updateById = async (req, res, next) => {
//     try {
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
//     } catch (error) {
//         next(error);
//     }
// }

// const deleteById = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const result = await contactService.removeContact(id)
//         if (!result) {
//             throw HttpError(404, error.message)
//         }

//         res.json({
//             message: "contact deleted"
//         })
//     } catch (error) {
//         next(error);
//     }
// }

export default {
    getAll,
    // getById,
    add,
    // updateById,
    // deleteById,
}