import HttpError from "../helpers/HttpError.js";
import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
} from "../services/contactsServices.js";

export const getAllContacts = (req, res) => {
  listContacts().then((contacts) => res.status(200).json(contacts));
};

export const getOneContact = (req, res) => {
  const {id} = req.params;
  getContactById(id)
    .then((contact) => {
      if (contact) {
        res.status(200).json(contact);
      } else {
        res.status(404).json({"message": "Not found"});
      }
    })
    .catch((error) => {
      console.log("Error: ", error);
    });

};

export const deleteContact = (req, res) => {
  const {id} = req.params;
  removeContact(id).then((contact)=>{
    if(contact){
      res.status(200).json(contact);
    } else {
      res.status(404).json({"message": "Not found"})
    }
  })
  .catch((error)=>{
    console.log('Error: ', error);
  })
};

export const createContact = (req, res) => {
 
};

export const updateContact = (req, res) => {};
