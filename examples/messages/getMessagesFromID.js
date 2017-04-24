const imessage = require("../../index.js");

const m = new imessage();

m.getMessagesFromID(1, (err, messages) => {
  if (err) {
    console.log(err);
  } else {
    console.log(messages);
  }
});

m.disconnect();
