### Node Library

#### Setup
```javascript
const imessage = require('imessage');
const m = new imessage();
```

#### Messages
```javascript
// Get all messages
m.getMessages(callback);

// Get messages with keyword
m.getMessagesWithText("keyword", callback);

// Get messages from recipient ID
m.getMessagesFromId(1, callback)

// Get messages from recipient with specific keyword text
m.getMessagesFromRecipientWithId(1, "keyword", callback)
```

#### Recipients

```javascript
// get all contact recipients
m.getRecipients(callback)

// Get recipients with handle "shelley"
m.getRecipients("shelley", callback)

// Get recipient with ID 1
m.getRecipientById(1, callback)

// Get recipient with ID 1 and all of their messages
m.getRecipientMessagesByID(1, callback)
```

#### Top Contacts

```javascript
// get top 10 contacts from last 30 days and related info
m.getTopContacts(10, 30, callback)
```

### Attachments

```javascript
// Get all attachments
m.getAllAttachments(callback)

// Get attachments from recipient with ID 1
m.getAttachmentsFromRecipientWithId(1, callback)
```
