import fs from "fs/promises";
import path from "path";

import Contact from "../models/contacts.js";

import { HttpError } from "../helpers/index.js";

import { ctrlWrapper } from "../decorators/index.js"

export const avatarPath = path.resolve("public", "avatars");

const getAll = async (req, res,) => {
    const { _id: owner } = req.user;
    const { page = 1, limit = 10 } = req.query; // пагінація
    const skip = (page - 1) * limit; 
        const result = await Contact.find({owner}, "_", {skip, limit}).populate("owner", "email"); // отримуємо список контактів вже з мангуса
        res.json(result);
}

const getById = async (req, res) => {
    const { id } = req.params; // беремо марштур з Ід
    const { _id: owner } = req.user;
    // const result = await Contact.findById(id);//інший метод монгуса
    const result = await Contact.findOne({_id: id, owner});
        if (!result) {
            throw HttpError(404); 
        }
        res.json(result); 
}

const add = async (req, res) => {
    const { _id: owner } = req.user; // отримали айді власника
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(avatarPath, filename);
    await fs.rename(oldPath, newPath);
    const avatar = path.join("avatars", filename);
        const result = await Contact.create({...req.body, avatar, owner}); // створюєио вже в мангусі
            res.status(201).json(result);
}

const updateById = async (req, res) => {
    const { id } = req.params;
    const { _id: owner } = req.user;
    // const result = await Contact.findByIdAndUpdate(id, req.body); //(+ доадли хук параметру для оновлення бо за замовчуванням не оновлує)
        const result = await Contact.findOneAndUpdate({_id: id, owner}, req.body);
        if (!result) {
            throw HttpError(404, error.message);
        }
        
        res.json(result);
}

const deleteById = async (req, res) => {
    const { id } = req.params;
    const { _id: owner } = req.user;
    // const result = await Contact.findByIdAndDelete(id);
    const result = await Contact.findOneAndDelete({_id, owner});
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