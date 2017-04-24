const imessage = require("../../index.js");

const m = new imessage();

m.getRecipientMessagesByID(1, (err, recipient) => {
  if (err) {
    console.log(err);
  } else {
    console.log(recipient);
    console.log(recipient.messages);
  }
});

m.disconnect();
