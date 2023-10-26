import Contact from "../models/contacts.js";

import { HttpError } from "../helpers/index.js";

import {ctrlWrapper} from "../decorators/index.js"

const getAll = async (req, res, ) => {
        const result = await Contact.find(); // отримуємо список контактів вже з мангуса
        res.json(result);
}

const getById = async (req, res) => {
        const { id } = req.params; // беремо марштур з Ід
    // const result = await Contact.findOne({_id: id}); пошук по іншим критеріям
        const result = await Contact.findById(id);//інший метод монгуса
        if (!result) {
            throw HttpError(404); 
        }
        res.json(result); 
}

const add = async (req, res) => {
        const result = await Contact.create(req.body); // створюєио вже в мангусі
            res.status(201).json(result);
}

const updateById = async (req, res) => {
        const { id } = req.params;
        const result = await Contact.findByIdAndUpdate(id, req.body); //(+ доадли хук параметру для оновлення бо за замовчуванням не оновлує)
        if (!result) {
            throw HttpError(404, error.message);
        }
        
        res.json(result);
}

const deleteById = async (req, res) => {
        const { id } = req.params;
        const result = await Contact.findByIdAndDelete(id);
        if (!result) {
            throw HttpError(404, error.message)
        }

        res.json({
            message: "contact deleted"
        })
}

export default {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    updateById: ctrlWrapper(updateById),
    deleteById: ctrlWrapper(deleteById),
}