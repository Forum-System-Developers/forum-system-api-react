from uuid import UUID

from fastapi import WebSocket


class WebSocketManager:
    """
    Manages WebSocket connections for users.

    Attributes:
        active_connections (dict[UUID, WebSocket]): A dictionary mapping user IDs to their WebSocket connections.

    Methods:
        connect(websocket: WebSocket, user_id: UUID) -> None:
            Adds a new WebSocket connection for a user.
        
        disconnect(user_id: UUID) -> None:
            Removes the WebSocket connection for a user.
        
        send_message(message: str, receiver_id: UUID) -> None:
            Sends a message to a specific user via their WebSocket connection.
    """
    def __init__(self) -> None:
        self.active_connections: dict[UUID, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: UUID) -> None:
        """
        Establish a connection for a given user.

        Args:
            websocket (WebSocket): The WebSocket connection instance.
            user_id (UUID): The unique identifier of the user.
        """
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: UUID) -> None:
        """
        Disconnects a user by removing their connection from the active connections.

        Args:
            user_id (UUID): The unique identifier of the user to disconnect.
        """
        self.active_connections.pop(user_id, None)

    async def send_message(self, message: str, receiver_id: UUID) -> None:
        """
        Sends a message to a specified receiver if they are connected.

        Args:
            message (str): The message to be sent.
            receiver_id (UUID): The unique identifier of the receiver.

        Raises:
            RuntimeError: If there is an error sending the message, the receiver will be disconnected.
        """
        receiver = self.active_connections.get(receiver_id)
        if receiver is not None:
            try:    
                await receiver.send_text(message)
            except RuntimeError:
                self.disconnect(receiver_id)
