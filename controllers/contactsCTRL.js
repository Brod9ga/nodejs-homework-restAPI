import { HttpError } from "../helpers/index.js";
import { Contact } from "../models/ContactsSchema.js";

import path from "path";
import { ctrlWrapper } from "../decorators/index.js";
import contactsAddSchema, { contactsUpdateSchema } from "./SchemaJoi.js";



const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user
  const { page = 1, limit = 10 } = req.query
  const skip = limit * (page - 1);
   const result = await Contact.find({owner}, {skip, limit}).populate("owner", "email");
   res.json(result);
};

const getContactById = async (req, res) => {
  
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);
  if (!result) {
    throw res.status(404).json("Not Found");
  }
    res.json(result);
  
};

const addContact = async (req, res) => {
  const { error } = contactsAddSchema.validate(req.body);
  if (error) {
    throw res.status(400).json("missing required name field");
  }
  const { _id: owner } = req.user
 

  const result = await Contact.create({ ...req.body, owner })
  res.status(201).json(result);
}
 
const removeContact = async (req, res) => { 
   const { contactId } = req.params;
   const result = await Contact.findByIdAndDelete(contactId);
   if (!result) {
     throw res.status(404).json("Not Found");
   }
   res.status(200).json("contact deleted");
}

const updateContact = async (req, res) => { 
  const { contactId } = req.params;
  const { error } = contactsUpdateSchema.validate(req.body);
  if (error) {
    throw new Error("Validation error");
  }
  const existingContact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!existingContact) {
    throw new Error("Not Found");
  }
  res.json(existingContact);
}

const updateFavorite = async (req, res) => { 
  const { contactId } = req.params;

  const existingContact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!existingContact) {
    throw new Error("Not Found");
  }
  res.json(existingContact);
}



export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  removeContact: ctrlWrapper(removeContact),
  updateContact: ctrlWrapper(updateContact),
  updateFavorite: ctrlWrapper(updateFavorite)
}
