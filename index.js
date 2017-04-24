const sqlite3 = require("sqlite3").verbose();
const homedir = require("homedir");

const HOME = homedir();

imessage.OSX_EPOCH = 978307200;
imessage.DB_PATH = `${HOME}/Library/Messages/chat.db`;

function imessage(options) {
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
            reject(err);
          }
          resolve(db);
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
  getDB() {
    return this.db;
  },
  // return all message recipients
  getAllRecipients() {
    let results;
    this.db.then((db) => {
      db.all("SELECT * FROM 'handle'", (err, ret) => {
        if (err) throw new Error(err);
        results = ret;
      });
      return results;
    });
  },
  // return all message recipients with specified handle
  getRecipientByHandle(handle) {
    let results;
    this.db.then((db) => {
      db.all(`SELECT * FROM 'handle' WHERE id LIKE '%${handle}%'`, (err, ret) => {
        if (err) throw new Error(err);
        results = ret;
      });
      return results;
    });
  },
  // return all message recipients with specified id
  getRecipientByID(id) {
    let results;
    this.db.then((db) => {
      db.all(`SELECT * FROM 'handle' WHERE ROWID = ${id}`, (err, ret) => {
        if (err) throw new Error(err);
        results = ret;
      });
      return results;
    });
  },
  // return all messages from recipient with specified id
  getRecipientMessagesByID(id) {
    let results;
    let recipient = {};
    this.db.then((db) => {
      db.get(`SELECT * FROM 'handle' WHERE ROWID = ${id}`,
      (err, ret) => {
        if (err) throw new Error(err);
        recipient = ret;
        db.all(`SELECT * FROM 'message' WHERE handle_id = ${id}`, (error, messages) => {
          if (error) throw new Error(error);
          recipient.messages = messages;
          results = recipient;
        });
      });
      return results;
    });
  },
  // return all messages
  getAllMessages() {
    let results;
    this.db.then((db) => {
      db.all("SELECT * FROM 'message'", (err, ret) => {
        if (err) throw new Error(err);
        results = ret;
      });
      return results;
    });
  },
  // get messages containing specified text
  getMessagesWithText(keywordText) {
    let results;
    this.db.then((db) => {
      const where = `WHERE 'message'.text LIKE '%${keywordText}%'`;
      db.all(`SELECT * FROM 'message' ${where}`, (err, ret) => {
        if (err) throw new Error(err);
        results = ret;
      });
      return results;
    });
  },
  // Get messages from recipient ID
  getMessagesFromRecipientWithText(id, keywordText) {
    let results;
    this.db.then((db) => {
      const where = `AND text LIKE '%${keywordText}%'`;
      db.all(`SELECT * FROM 'message' WHERE handle_id = ${id} ${where}`, (err, messages) => {
        if (err) throw new Error(err);
        results = messages;
      });
      return results;
    });
  },
  // get all attachments
  getAllAttachments() {
    let results;
    this.db.then((db) => {
      db.all(`SELECT * FROM 'message'
        INNER JOIN 'message_attachment_join'
        ON 'message'.ROWID = 'message_attachment_join'.message_id
        INNER JOIN 'attachment'
        ON 'attachment'.ROWID = 'message_attachment_join'.attachment_id`, (err, messages) => {
        if (err) throw new Error(err);
        results = messages;
      });
      return results;
    });
  },
  // get attachments from specified id
  getAttachmentsByID(id) {
    let results;
    this.db.then((db) => {
      db.all(`SELECT * FROM 'message'
        INNER JOIN 'message_attachment_join'
        ON 'message'.ROWID = 'message_attachment_join'.message_id
        INNER JOIN 'attachment'
        ON 'attachment'.ROWID = 'message_attachment_join'.attachment_id \
        WHERE 'message'.handle_id = ${id}`, (err, messages) => {
        if (err) throw new Error(err);
        results = messages;
      });
      return results;
    });
  },
  // get top contacts from last specified days and limit
  getTopContacts(limit, days) {
    let results;
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
        LIMIT ${limit};`, (err, ret) => {
        if (err) throw new Error(err);
        results = ret;
      });
      return results;
    });
  },
};

module.exports = imessage;
