### Node Library

This library allows you to query and chain commands to your local iMessage database.

#### Install

`npm install nodemessage`

#### Setup
```javascript
const imessage = require('imessage');
const m = new imessage();
```

#### Messages
```javascript
// Get all messages
m.getAllMessages();

// Get messages with keyword
m.getMessagesWithText("keyword");

// Get messages from recipient ID
m.getMessagesFromID(1)

// Get messages from recipient with specific keyword text
m.getMessagesFromRecipientWithID(1, "keyword")
```

#### Recipients

```javascript
// get all contact recipients
m.getAllRecipients()

// Get recipients with handle "shelley"
m.getRecipientByHandle("shelley")

// Get recipient with ID 1
m.getRecipientByID(1)

// Get recipient with ID 1 and all of their messages
m.getRecipientMessagesByID(1)
```

#### Top Contacts

```javascript
// get top 10 contacts from last 30 days and related info
m.getTopContacts(10, 30)
```

#### Attachments

```javascript
// Get all attachments
m.getAllAttachments()

// Get attachments from recipient with ID 1
m.getAttachmentsByID(1)
```

#### Example

```javascript
const imessage = require('imessage');
const m = new imessage();

const attachments = getAllAttachments();
attachments.each((attachment) => {
  console.log(attach);
});

m.disconnect();
```
