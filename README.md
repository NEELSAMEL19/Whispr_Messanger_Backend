## Messaging API

All messaging routes require the authentication cookie created by `/api/auth/login` or `/api/auth/register`.

- `GET /api/messages/:userId?page=1&limit=30` fetches a direct conversation.
- `POST /api/messages/:userId` sends `{ "content": "Hello" }`.
- `PATCH /api/messages/:userId/read` marks incoming messages as read.
- `PATCH /api/messages/message/:messageId` edits the sender's message.
- `DELETE /api/messages/message/:messageId` soft-deletes the sender's message.

The server also exposes Socket.IO on the same port. It authenticates using the `token` cookie or `socket.auth.token` and supports:

- Client events: `send_message`, `typing`, `stop_typing`, `mark_read`.
- Server events: `new_message`, `user_online`, `user_offline`, `user_typing`, `user_stopped_typing`, `message_read`.
