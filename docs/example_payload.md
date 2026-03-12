# Facebook Messenger Webhook Payload Example

When a user sends a message to your Page, Facebook sends a `POST` request to your webhook with a JSON body similar to this:

```json
{
  "object": "page",
  "entry": [
    {
      "id": "PAGE_ID",
      "time": 1618312345678,
      "messaging": [
        {
          "sender": {
            "id": "USER_PSID" 
          },
          "recipient": {
            "id": "PAGE_ID"
          },
          "timestamp": 1618312345000,
          "message": {
            "mid": "m_1234567890...",
            "text": "Hello, bot!"
          }
        }
      ]
    }
  ]
}
```

### Key Fields to Extract:

1.  **PSID (`sender.id`)**: This is the unique ID for the user *interacting with your page*. You use this ID to send a reply back.
2.  **Message Text (`message.text`)**: The actual text content sent by the user.

### Handling Multiple Entries:
In some cases, Facebook might batch multiple messages into a single request. Our implementation uses a `for...of` loop over `body.entry` to ensure every message is processed.
