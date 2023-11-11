import express from "express";

import contactsController from "../../controllers/contacts-controller.js";

import { validateBody } from "../../decorators/index.js";

import { contactAddSchema, contactUpdateSchema, contactUpdateFavoriteSchema } from "../../models/contacts.js";

import { authenticate, upload, isValidId } from "../../middelewares/index.js";

const router = express.Router();

router.use(authenticate);

router.get('/', contactsController.getAll);

router.get('/:id', isValidId, contactsController.getById);

// upload.fields({name: "poster", maxCount: 1}) - якщо в кількох полях
// upload.array("poster", 9) - якщо в 1-му полі кілька файлів
router.post('/', upload.single("avatar"), validateBody(contactAddSchema), contactsController.add);

router.delete('/:id', isValidId, contactsController.deleteById);

router.put('/:id', isValidId, validateBody(contactUpdateSchema), contactsController.updateById);

router.patch("/:id/favorite", isValidId, validateBody(contactUpdateFavoriteSchema), contactsController.updateById);// patch запит на поле оновлення

export default router;
