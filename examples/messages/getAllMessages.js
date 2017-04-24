const imessage = require("../../index.js");

const m = new imessage();

m.getAllMessages("shelley", (err, messages) => {
  if (err) {
    console.log(err);
  } else {
    console.log(messages);
  }
});

m.disconnect();
