import * as fs from "node:fs/promises";
import path from "node:path";

const contactsPath = path.resolve("db", "contacts.json");

async function readContacts() {
  const contacts = await fs.readFile(contactsPath, { encoding: "utf8" });
  return JSON.parse(contacts);
}

async function writeContacts(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
}

async function listContacts() {
  const contacts = await readContacts();
  return contacts;
}

async function getContactById(contactId) {
  const contacts = await readContacts();
  const contact = contacts.find((contact) => contact.id === contactId);
  if (typeof contact === "undefined") {
    return null;
  }
  return contact;
}

async function removeContact(contactId) {
  const contacts = await readContacts();
  const contactIndex = contacts.findIndex(
    (contact) => contact.id === contactId
  );
  if (contactIndex === -1) {
    return null;
  }
  const removedContact = contacts[contactIndex];
  const newContacts = [
    ...contacts.slice(0, contactIndex),
    ...contacts.slice(contactIndex + 1),
  ];
  await writeContacts(newContacts);
  return removedContact;
}

async function addContact(contact) {
  const contacts = await readContacts();
  const newContact = { ...contact, id: crypto.randomUUID() };
  contacts.push(newContact);
  await writeContacts(contacts);
  return newContact;
}

export { listContacts, getContactById, removeContact, addContact };
