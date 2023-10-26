import express from "express";

import contactsController from "../../controllers/contacts-controller.js";

import { validateBody } from "../../decorators/index.js";

import { contactAddSchema, contactUpdateSchema, contactUpdateFavoriteSchema } from "../../models/contacts.js";

import { isValidId } from "../../middelewares/index.js";

const router = express.Router()

router.get('/', contactsController.getAll);

router.get('/:id', isValidId, contactsController.getById);

router.post('/', validateBody(contactAddSchema), contactsController.add);

router.delete('/:id', isValidId, contactsController.deleteById);

router.put('/:id', isValidId, validateBody(contactUpdateSchema), contactsController.updateById);

router.patch("/:id/favorite", isValidId, validateBody(contactUpdateFavoriteSchema), contactsController.updateById);// patch запит на поле оновлення

export default router;
