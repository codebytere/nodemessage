const sqlite3 = require("sqlite3").verbose();
const homedir = require("homedir");

const HOME = homedir();

imessage.DATA_OFFSET = 978307200;
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
    return new Promise((resolve, reject) => {
      this.db.then((db) => {
        db.all("SELECT * FROM handle", (err, recipients) => {
          if (err) reject(err);
          resolve(recipients);
        });
      });
    });
  },
  // return all message recipients with specified handle
  getRecipientByHandle(handle) {
    return new Promise((resolve, reject) => {
      this.db.then((db) => {
        db.all(`SELECT * FROM handle WHERE id LIKE %${handle}%`, (err, recipient) => {
          if (err) reject(err);
          resolve(recipient);
        });
      });
    });
  },
  // return all message recipients with specified id
  getRecipientByID(id) {
    return new Promise((resolve, reject) => {
      this.db.then((db) => {
        db.all(`SELECT * FROM handle WHERE ROWID = ${id}`, (err, recipient) => {
          if (err) reject(err);
          resolve(recipient);
        });
      });
    });
  },
  // return all messages from recipient with specified id
  getRecipientMessagesByID(id) {
    return new Promise((resolve, reject) => {
      let recipient = {};
      this.db.then((db) => {
        db.get(`SELECT * FROM handle WHERE ROWID = ${id}`, (err, ret) => {
          if (err) reject(err);
          recipient = ret;
          db.all(`SELECT * FROM message WHERE handle_id = ${id}`, (error, messages) => {
            if (error) reject(error);
            recipient.messages = messages;
            resolve(recipient);
          });
        });
      });
    });
  },
  // return all messages
  getAllMessages() {
    return new Promise((resolve, reject) => {
      this.db.then((db) => {
        db.all("SELECT text FROM message", (err, messages) => {
          if (err) reject(err);
          resolve(messages);
        });
      });
    });
  },
  // get messages containing specified text
  getMessagesWithText(keywordText) {
    return new Promise((resolve, reject) => {
      this.db.then((db) => {
        const where = `WHERE message.text LIKE %${keywordText}%`;
        db.all(`SELECT * FROM message ${where}`, (err, messages) => {
          if (err) reject(err);
          resolve(messages);
        });
      });
    });
  },
  // Get messages from recipient ID
  getMessagesFromRecipientWithText(id, keywordText) {
    return new Promise((resolve, reject) => {
      this.db.then((db) => {
        const where = `AND text LIKE %${keywordText}%`;
        db.all(`SELECT * FROM message WHERE handle_id = ${id} ${where}`, (err, messages) => {
          if (err) reject(err);
          resolve(messages);
        });
      });
    });
  },
  // get all attachments
  getAllAttachments() {
    return new Promise((resolve, reject) => {
      this.db.then((db) => {
        db.all(`SELECT * FROM message
          INNER JOIN message_attachment_join
          ON message.ROWID = message_attachment_join.message_id
          INNER JOIN attachment
          ON attachment.ROWID = message_attachment_join.attachment_id`, (err, messages) => {
          if (err) reject(err);
          resolve(messages);
        });
      });
    });
  },
  // get attachments from specified id
  getAttachmentsByID(id) {
    return new Promise((resolve, reject) => {
      this.db.then((db) => {
        db.all(`SELECT * FROM message
          INNER JOIN message_attachment_join
          ON message.ROWID = message_attachment_join.message_id
          INNER JOIN attachment
          ON attachment.ROWID = message_attachment_join.attachment_id \
          WHERE message.handle_id = ${id}`, (err, messages) => {
          if (err) reject(err);
          resolve(messages);
        });
      });
    });
  },
  // get top contacts from last specified days and limit
  getTopContacts(limit, days) {
    const seconds = days * 86400;
    return new Promise((resolve, reject) => {
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
          LIMIT ${limit};`, (err, contacts) => {
          if (err) reject(err);
          resolve(contacts);
        });
      });
    });
  },
};

module.exports = imessage;
