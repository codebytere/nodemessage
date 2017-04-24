const imessage = require("../../index.js");

const m = new imessage();

m.getMessagesFromRecipientWithText(1, "hello world", (err, messages) => {
  if (err) {
    console.log(err);
  } else {
    console.log(messages);
  }
});

m.disconnect();
