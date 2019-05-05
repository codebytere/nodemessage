# Message Methods

## `getAllMessages()`

Returns an array containing all messages both sent and received.

Example:

```js
m.getAllMessages.then(messages => {
  console.log(messages)
})
```

## `getMessagesWithText(keywordText)`

Returns an array containing all messages both sent and received that contain at least one instance of the `keywordText`.

Example:

```js
m.getMessagesWithText('hello').then(messages => {
  console.log(`You've received ${messages.count} messaged containing ${keywordText}`)
})
```
