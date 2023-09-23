import express from "express";

import contactsCTRL from "../../controllers/contactsCTRL.js";
import { isValidId } from "../../middlewares/index.js";
import authorization from "../../middlewares/authenticate.js";

const router = express.Router();

router.use(authorization);

router.get("/", contactsCTRL.getAllContacts);

router.get("/:contactId", isValidId, contactsCTRL.getContactById);

router.post("/", contactsCTRL.addContact);

router.delete("/:contactId", isValidId, contactsCTRL.removeContact);

router.put("/:contactId", isValidId, contactsCTRL.updateContact);

router.patch("/:contactId/favorite", isValidId, contactsCTRL.updateFavorite);

export default router;
