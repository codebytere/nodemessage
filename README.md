### Node Library

This library allows you to query and chain commands to your local iMessage database.

#### Setup
```javascript
const imessage = require('imessage');
const m = new imessage();
```

#### Messages
```javascript
// Get all messages
m.getAllMessages(callback);

// Get messages with keyword
m.getMessagesWithText("keyword", callback);

// Get messages from recipient ID
m.getMessagesFromID(1, callback)

// Get messages from recipient with specific keyword text
m.getMessagesFromRecipientWithID(1, "keyword", callback)
```

#### Recipients

```javascript
// get all contact recipients
m.getAllRecipients(callback)

// Get recipients with handle "shelley"
m.getRecipientByHandle("shelley", callback)

// Get recipient with ID 1
m.getRecipientByID(1, callback)

// Get recipient with ID 1 and all of their messages
m.getRecipientMessagesByID(1, callback)
```

#### Top Contacts

```javascript
// get top 10 contacts from last 30 days and related info
m.getTopContacts(10, 30, callback)
```

#### Attachments

```javascript
// Get all attachments
m.getAllAttachments(callback)

// Get attachments from recipient with ID 1
m.getAttachmentsByID(1, callback)
```
