const imessage = require("../../index.js");

const m = new imessage();

m.getAllRecipients((err, recipients) => {
  if (err) {
    console.log(err);
  } else {
    console.log(recipients);
  }
});

m.disconnect();
