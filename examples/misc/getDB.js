const imessage = require("../../index.js");

const m = new imessage();

m.getDb((err, db) => {
  if (err) {
    console.log(err);
  } else {
    db.all("SELECT * FROM 'message'", (error, res) => {
      console.log(error, res);
    });
  }
});

m.disconnect();
