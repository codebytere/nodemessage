const homedir = require('homedir')
const sqlite3 = require('sqlite3').verbose()
const { formattedTime } = require('./utils')

const HOME = homedir()

class imessage {
  constructor () {
    this.path = `${HOME}/Library/Messages/chat.db`
    this.db = this.connect()
  }

  // open connection to the database
  connect () {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(
        this.path,
        sqlite3.OPEN_READONLY,
        (err, res) => {
          if (err) reject(err)
          resolve(db)
        })
    })
  }

  // close connection to the database
  disconnect () {
    this.db.then((db) => {
      db.close()
    })
  }

  // get database
  getDB () {
    return this.db
  }

  // return all message recipients
  getAllRecipients () {
    return new Promise((resolve, reject) => {
      this.db.then((db) => {
        const query = 'SELECT * FROM handle'

        db.all(query, (err, recipients) => {
          if (err) reject(err)
          resolve(recipients)
        })
      })
    })
  }

  // return all message recipients with specified handle
  getRecipientByNumber (number) {
    return new Promise((resolve, reject) => {
      this.db.then((db) => {
        const query = `
          SELECT *
            FROM handle
            WHERE id = '${number}'`

        db.all(query, (err, recipient) => {
          if (err) reject(err)
          resolve(recipient)
        })
      })
    })
  }

  // return message recipient with specified id
  getRecipientByID (id) {
    return new Promise((resolve, reject) => {
      this.db.then((db) => {
        const query = `
          SELECT *
            FROM handle
            WHERE ROWID = ${id}`

        db.all(query, (err, recipient) => {
          if (err) reject(err)
          resolve(recipient)
        })
      })
    })
  }

  // return all messages from recipient with specified id
  getRecipientMessagesByID (id) {
    return new Promise((resolve, reject) => {
      let recipient = {}
      this.db.then((db) => {
        const recipientQuery = `
          SELECT *
            FROM handle
            WHERE ROWID = ${id}`

        db.get(recipientQuery, (err, ret) => {
          if (err) reject(err)
          recipient = ret
          const messagesQuery = `
            SELECT text
              FROM message
              WHERE handle_id = ${id}`

          db.all(messagesQuery, (error, messages) => {
            if (error) reject(error)
            recipient.messages = messages
            resolve(recipient)
          })
        })
      })
    })
  }

  // return all messages
  getAllMessages () {
    return new Promise((resolve, reject) => {
      this.db.then((db) => {
        const query = 'SELECT text FROM message'

        db.all(query, (err, messages) => {
          if (err) reject(err)
          resolve(messages)
        })
      })
    })
  }

  // get messages containing specified text keyword
  getMessagesWithText (keywordText) {
    return new Promise((resolve, reject) => {
      this.db.then((db) => {
        const query = `
          SELECT text
            FROM message
            WHERE text LIKE '%${keywordText}%'`

        db.all(query, (err, messages) => {
          if (err) reject(err)
          resolve(messages)
        })
      })
    })
  }

  // Get messages from recipient ID
  getMessagesFromRecipientWithText (id, keywordText) {
    return new Promise((resolve, reject) => {
      this.db.then((db) => {
        const query = `
          SELECT text
            FROM message
            WHERE handle_id = ${id}
            AND text LIKE '%${keywordText}%'`

        db.all(query, (err, messages) => {
          if (err) reject(err)
          resolve(messages)
        })
      })
    })
  }

  // get all attachments
  getAllAttachments () {
    return new Promise((resolve, reject) => {
      this.db.then((db) => {
        const query = `
          SELECT *
            FROM message
          INNER JOIN message_attachment_join
            ON message.ROWID = message_attachment_join.message_id
          INNER JOIN attachment
            ON attachment.ROWID = message_attachment_join.attachment_id`

        db.all(query, (err, attachments) => {
          if (err) reject(err)
          resolve(attachments)
        })
      })
    })
  }

  // get communications for a given number
  getAllForNumber (handle, options = {
    filters: ['*']
  }) {
    return new Promise((resolve, reject) => {
      this.db.then(db => {
        const query = `
          SELECT ${options.filters.join(', ')}
            FROM chat
          INNER JOIN handle 
            ON chat.chat_identifier = handle.id
          INNER JOIN chat_handle_join 
            ON  handle.ROWID= chat_handle_join.handle_id 
          INNER JOIN message
            ON message.handle_id = chat_handle_join.handle_id
              WHERE chat_identifier = '${handle}' 
                AND length(message.text) > 0`
        
        db.all(query, (err, messages) => {
          if (err) reject(err)
          messages = messages.map(m => {
            // format dates if they were queried
            if (m.date_read) m.date_read = formattedTime(m.date_read)
            if (m.date) m.date = formattedTime(m.date)
            return m
          })
          resolve(messages)
        })
      })
    })
  }

  // get attachments from specified id
  getAttachmentsForID (id) {
    return new Promise((resolve, reject) => {
      this.db.then((db) => {
        const query = `
          SELECT *
            FROM message
          INNER JOIN message_attachment_join
            ON message.ROWID = message_attachment_join.message_id
          INNER JOIN attachment
            ON attachment.ROWID = message_attachment_join.attachment_id \
          WHERE message.handle_id = ${id}`

        db.all(query, (err, attachments) => {
          if (err) reject(err)
          resolve(attachments)
        })
      })
    })
  }
}

module.exports = imessage
