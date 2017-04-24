const imessage = require("../../index.js");

const m = new imessage();

m.getRecipientByHandle("shelley", (err, recipient) => {
  if (err) {
    console.log(err);
  } else {
    console.log(recipient);
  }
});

m.disconnect();
