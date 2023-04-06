const fs = require('fs/promises');
const path = require('path');
const uuid = require('uuid');

const contactsPath = path.resolve('models', 'contacts.json');
const stringify = (data) => JSON.stringify(data, null, 2);

const listContacts = async () => {
    const contacts = await fs.readFile(contactsPath, 'utf-8');
    return JSON.parse(contacts);
};

const getContactById = async (contactId) => {
    const contacts = await listContacts();
    const contact = contacts.find(({ id }) => id === contactId);

    return contact;
};

const removeContact = async (contactId) => {
    const contacts = await listContacts();
    const contactIdx = contacts.findIndex(({ id }) => id === contactId);

    if (contactIdx === -1) {
        return null;
    }

    const [removedContact] = contacts.splice(contactIdx, 1);

    await fs.writeFile(contactsPath, stringify(contacts));

    return removedContact;
};

const addContact = async (body) => {
    try {
        const contacts = await listContacts();
        const isExit = contacts.some(({ phone }) => phone === body.phone);

        if (isExit) {
            return null;
        }

        const { name, email, phone } = body;

        const newContact = {
            id: uuid.v4(),
            name,
            email,
            phone,
        };

        fs.writeFile(contactsPath, stringify([...contacts, newContact]));
        return newContact;
    } catch (error) {
        console.log(error);
        return { error };
    }
};

const updateContact = async (contactId, body) => {
    const contacts = await listContacts();
    const contactIndx = contacts.findIndex(({ id }) => id === contactId);

    if (contactIndx === -1) {
        return null;
    }

    contacts[contactIndx] = { ...contacts[contactIndx], ...body };

    await fs.writeFile(contactsPath, stringify(contacts));

    return contacts[contactIndx];
};

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
};
