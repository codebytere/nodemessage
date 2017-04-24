const imessage = require("../../index.js");

const m = new imessage();

m.getAllAttachments((err, attachments) => {
  if (err) {
    console.log(err);
  } else {
    console.log(attachments);
  }
});

m.disconnect();
