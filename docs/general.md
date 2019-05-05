# Multi-Purpose Methods

## `getAllForNumber(number, options)`

Returns all communications and properties of those communications as associated with a particiular phone number.

* `number` (String) - the target phone number, formatted internationally ('+15558675309')
* `options` (Object) - Filter options for the query
  * `filters` (Array) - filters to pass to the query.
    * `is_from_me` - whether you sent or received the message
    * `date` - the date the message was sent
    * `date_read` - the date the message was read
    * `text` - the text of the message
    * `chat_identifier` - the target phone number, formatted internationally (ex. '+15558675309')
    * `is_expirable` - whether the message was an expirable message
    * `is_delivered` - whether the message was delivered
    * `is_emote` - whether the message is an emoji
    * `chat_id` - the chat id of the message
    * `handle_id` - the id associated with message handle (phone number)
    * `is_audio_message` - whether the message is an audio message
    * `is_corrupt` - whether the message was corrupted

  Example:

  ```js
  m.getAllForNumber('+15558675309', {
    filters: [
      'date',
      'text',
      'handle_id'
    ]
  }).then(messages => {
    console.log(messages)
  }).catch(err => {
    console.log(error)
  })
  ```