const imessage = require("../../index.js");

const m = new imessage();

m.getRecipientByID(1, (err, recipient) => {
  if (err) {
    console.log(err);
  } else {
    console.log(recipient);
  }
});

m.disconnect();
