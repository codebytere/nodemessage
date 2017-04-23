### Node Library

#### Setup
```
var imessage = require('imessage');
var m = new imessage();
```

#### Messages
```
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

```
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

```
// get top 10 contacts from last 30 days and related info
m.getTopContacts(10, 30, callback)
```

### Attachments

```
// Get all attachments
m.getAllAttachments(callback)

// Get attachments from recipient with ID 1
m.getAttachmentsFromRecipientWithId(1, callback)
```
