import express from "express";

import contactsController from "../../controllers/contacts-controller.js";

import { validateBody } from "../../decorators/index.js";

import { contactAddSchema, contactUpdateSchema } from "../../models/contacts.js";

const router = express.Router()

router.get('/', contactsController.getAll);

// router.get('/:id', contactsController.getById);

router.post('/', validateBody(contactAddSchema), contactsController.add);

// router.delete('/:id', contactsController.deleteById);

// router.put('/:id', validateBody(contactUpdateSchema), contactsController.updateById);

export default router;
