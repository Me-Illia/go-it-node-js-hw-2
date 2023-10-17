// const fs = require('fs/promises') work only in CommonJS

import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("models", "contacts.json"); // знаходимо файл
// const contactsPath = path.join(__dirname, "contacts.json") - work only in CommonJS

const updateContacts = contacts =>  fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2)); // перезаписуємо файл

export async function listContacts() {
    // ...твій код. Повертає масив контактів.
    const data = await fs.readFile(contactsPath, "utf-8"); // зчитуємо файл
    return JSON.parse(data); 
}

export async function getContactById(contactId) {
    // ...твій код. Повертає об'єкт контакту з таким id. Повертає null, якщо контакт з таким id не знайдений.
    const contacts = await listContacts();
    const result = contacts.find(item => item.id === contactId);
    return result || null;
}

export async function removeContact(contactId) {
    // ...твій код. Повертає об'єкт видаленого контакту. Повертає null, якщо контакт з таким id не знайдений.
    const contacts = await listContacts();
    const index = contacts.findIndex(item => item.id == contactId);
    if (index === - 1) {
        return null;
    } 
    const [result] = contacts.splice(index, 1); 
    await updateContacts(contacts) // перезаписуємо файл 
    return result; // повертаємо видаленний елемент (це для логу при виконанні щоби показало - що саме видалили)
}

export async function addContact(data) {
    // ...твій код. Повертає об'єкт доданого контакту. 
    const contacts = await listContacts();
    const newContact = { // створюю новий обєкт контакту (...data спеціально якщо даних буде більше)
        id: nanoid(),
        ...data,
    };
    contacts.push(newContact);
    await updateContacts(contacts) // перезаписуємо файл 
    return newContact;
}

export const updateContactById = async (contactId, data) => {
    const contacts = await listContacts();
    const index = contacts.findIndex(item => item.id === contactId);
    if (index === -1) {
        return null;
    }
    contacts[index] = { ...contacts[index], ...data };
    await updateContacts(contacts);
    return contacts[index];
}
