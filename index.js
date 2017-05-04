const homedir = require("homedir");
const sqlite3 = require("sqlite3").verbose();

const HOME = homedir();

class imessage {
  constructor() {
    this.path = `${HOME}/Library/Messages/chat.db`;
    this.db = this.connect();
  }
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
  }
  // close connection to the database
  disconnect() {
    this.db.then((db) => {
      db.close();
    });
  }
  // get database
  getDB() {
    return this.db;
  }
  // return all message recipients
  getAllRecipients() {
    return new Promise((resolve, reject) => {
      this.db.then((db) => {
        const query = "SELECT * FROM handle";

        db.all(query, (err, recipients) => {
          if (err) reject(err);
          resolve(recipients);
        });
      });
    });
  }
  // return all message recipients with specified handle
  getRecipientByHandle(handle) {
    return new Promise((resolve, reject) => {
      this.db.then((db) => {
        const query = `SELECT *
        FROM handle
        WHERE id LIKE %${handle}%`;

        db.all(query, (err, recipient) => {
          if (err) reject(err);
          resolve(recipient);
        });
      });
    });
  }
  // return message recipient with specified id
  getRecipientByID(id) {
    return new Promise((resolve, reject) => {
      this.db.then((db) => {
        const query = `SELECT *
        FROM handle
        WHERE ROWID = ${id}`;

        db.all(query, (err, recipient) => {
          if (err) reject(err);
          resolve(recipient);
        });
      });
    });
  }
  // return all messages from recipient with specified id
  getRecipientMessagesByID(id) {
    return new Promise((resolve, reject) => {
      let recipient = {};
      this.db.then((db) => {
        const recipientQuery = `SELECT *
        FROM handle
        WHERE ROWID = ${id}`;

        db.get(recipientQuery, (err, ret) => {
          if (err) reject(err);
          recipient = ret;
          const messagesQuery = `SELECT text
          FROM message
          WHERE handle_id = ${id}`;

          db.all(messagesQuery, (error, messages) => {
            if (error) reject(error);
            recipient.messages = messages;
            resolve(recipient);
          });
        });
      });
    });
  }
  // return all messages
  getAllMessages() {
    return new Promise((resolve, reject) => {
      this.db.then((db) => {
        const query = "SELECT text FROM message";

        db.all(query, (err, messages) => {
          if (err) reject(err);
          resolve(messages);
        });
      });
    });
  }
  // get messages containing specified text keyword
  getMessagesWithText(keywordText) {
    return new Promise((resolve, reject) => {
      this.db.then((db) => {
        const query = `SELECT text
        FROM message
        WHERE text LIKE '%${keywordText}%'`;

        db.all(query, (err, messages) => {
          if (err) reject(err);
          resolve(messages);
        });
      });
    });
  }
  // Get messages from recipient ID
  getMessagesFromRecipientWithText(id, keywordText) {
    return new Promise((resolve, reject) => {
      this.db.then((db) => {
        const query = `SELECT text
        FROM message
        WHERE handle_id = ${id}
        AND text LIKE '%${keywordText}%'`;

        db.all(query, (err, messages) => {
          if (err) reject(err);
          resolve(messages);
        });
      });
    });
  }
  // get all attachments
  getAllAttachments() {
    return new Promise((resolve, reject) => {
      this.db.then((db) => {
        const query = `SELECT * FROM message
          INNER JOIN message_attachment_join
          ON message.ROWID = message_attachment_join.message_id
          INNER JOIN attachment
          ON attachment.ROWID = message_attachment_join.attachment_id`;

        db.all(query, (err, messages) => {
          if (err) reject(err);
          resolve(messages);
        });
      });
    });
  }
  // get attachments from specified id
  getAttachmentsByID(id) {
    return new Promise((resolve, reject) => {
      this.db.then((db) => {
        const query = `SELECT * FROM message
          INNER JOIN message_attachment_join
          ON message.ROWID = message_attachment_join.message_id
          INNER JOIN attachment
          ON attachment.ROWID = message_attachment_join.attachment_id \
          WHERE message.handle_id = ${id}`;

        db.all(query, (err, messages) => {
          if (err) reject(err);
          resolve(messages);
        });
      });
    });
  }
  // get top contacts from last specified days and limit
  getTopContacts(limit, days) {
    const seconds = days * 86400;
    return new Promise((resolve, reject) => {
      this.db.then((db) => {
        const query = `SELECT handle.id,
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
          LIMIT ${limit};`;

        db.get(query, (err, contacts) => {
          if (err) reject(err);
          resolve(contacts);
        });
      });
    });
  }
}

module.exports = imessage;
