const sqlite3 = require("sqlite3").verbose();
const homedir = require("homedir");

const HOME = homedir();

imessage.OSX_EPOCH = 978307200;
imessage.DB_PATH = `${HOME}/Library/Messages/chat.db`;

function imessage(options) {
  // this.path = (options !== null) ? options.path : imessage.DB_PATH;
  this.path = imessage.DB_PATH;
  this.db = this.connect();
}

imessage.prototype = {
  // open connection to the database
  connect() {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(
        this.path,
        sqlite3.OPEN_READONLY,
        (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(db);
        });
    });
  },
  // close connection to the database
  disconnect() {
    this.db.then((db) => {
      db.close();
    });
  },
  // get database
  getDB(callback) {
    this.db.then((db) => {
      console.log(`db is ${db}`);
      callback(null, db);
    }, (err) => {
      callback(err);
    });
  },
  // return all message recipients
  getAllRecipients(callback) {
    this.db.then((db) => {
      db.all("SELECT * FROM 'handle'", callback);
    });
  },
  // return all message recipients with specified handle
  getRecipientByHandle(handle, callback) {
    this.db.then((db) => {
      db.all(`SELECT * FROM 'handle' WHERE id LIKE '%${handle}%'`, callback);
    });
  },
  // return all message recipients with specified id
  getRecipientByID(id, callback) {
    this.db.then((db) => {
      db.all(`SELECT * FROM 'handle' WHERE ROWID = ${id}`, callback);
    });
  },
  // return all messages from recipient with specified id
  getRecipientMessagesById(id, callback) {
    let recipient = {};
    this.db.then((db) => {
      db.get(`SELECT * FROM 'handle' WHERE ROWID = ${id}`,
      (err, ret) => {
        if (err) {
          return callback(err);
        }
        recipient = ret;
        db.all(`SELECT * FROM 'message' WHERE handle_id = ${id}`,
        (error, messages) => {
          if (error) {
            return callback(err);
          }
          recipient.messages = messages;
          return callback(error, recipient);
        });
      });
    });
  },
  // return all messages
  getAllMessages(callback) {
    this.db.then((db) => {
      db.all("SELECT * FROM 'message'", callback);
    });
  },
  // get messages containing specified text
  getMessagesWithText(keywordText, callback) {
    this.db.then((db) => {
      const where = `WHERE 'message'.text LIKE '%${keywordText}%'`;
      db.all(`SELECT * FROM 'message' ${where}`, callback);
    });
  },
  // Get messages from recipient ID
  getMessagesFromRecipientWithText(id, keywordText, callback) {
    this.db.done((db) => {
      const where = `AND text LIKE '%${keywordText}%'`;
      db.all(`SELECT * FROM 'message' WHERE handle_id = ${id} ${where}`,
      (err, messages) => {
        callback(err, messages);
      });
    });
  },
  // get all attachments
  getAllAttachments(callback) {
    this.db.then((db) => {
      db.all(`SELECT * FROM 'message'
        INNER JOIN 'message_attachment_join'
        ON 'message'.ROWID = 'message_attachment_join'.message_id
        INNER JOIN 'attachment'
        ON 'attachment'.ROWID = 'message_attachment_join'.attachment_id`,
        (err, messages) => {
          callback(err, messages);
        });
    });
  },
  // get attachments from specified id
  getAttachmentsById(id, callback) {
    this.db.then((db) => {
      db.all(`SELECT * FROM 'message'
        INNER JOIN 'message_attachment_join'
        ON 'message'.ROWID = 'message_attachment_join'.message_id
        INNER JOIN 'attachment'
        ON 'attachment'.ROWID = 'message_attachment_join'.attachment_id \
        WHERE 'message'.handle_id = ${id}`,
        (err, messages) => {
          callback(err, messages);
        });
    });
  },
  // get top contacts from last specified days and limit
  getTopContacts(limit, days, callback) {
    const seconds = days * 86400;
    this.db.then((db) => {
      db.get(`SELECT handle.id,
              COUNT(*)                                 AS 'total msgs',
              SUM(msg.is_from_me = 0)                  AS 'from them',
              SUM(msg.is_from_me = 1)                  AS 'from me',
              SUM(msg.is_from_me = 1)*100 / COUNT(*)   AS 'my percentage'
         FROM message AS msg
              INNER JOIN handle
                      ON msg.handle_id = handle.ROWID
        WHERE msg.service = 'iMessage'
        AND (
          (strftime('%s','now') - strftime('%s','2001-01-01')) - msg.date < ${seconds}
        )
        GROUP BY handle_id
        ORDER BY COUNT(*) DESC
        LIMIT ${limit};`, callback);
    });
  },
};

module.exports = imessage;
