from uuid import UUID

from fastapi import WebSocket

from forum_system_api.schemas.message import MessageResponse


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
        self._active_connections: dict[UUID, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: UUID) -> None:
        """
        Establish a WebSocket connection for a given user.

        If the user is already connected, disconnects the existing connection before establishing a new one.

        Args:
            websocket (WebSocket): The WebSocket connection to be established.
            user_id (UUID): The unique identifier of the user.
        """
        if user_id in self._active_connections:
            await self.disconnect(user_id)

        self._active_connections[user_id] = websocket

    async def disconnect(self, user_id: UUID) -> None:
        """
        Disconnects the WebSocket connection for the given user ID.

        This method removes the WebSocket connection associated with the provided
        user ID from the active connections and closes it if it exists.

        Args:
            user_id (UUID): The unique identifier of the user whose WebSocket 
                            connection is to be disconnected.
        """
        websocket = self._active_connections.pop(user_id, None)
        if websocket is not None and websocket.client_state.name != 'DISCONNECTED':
            await websocket.close()

    async def send_message_as_json(self, message: MessageResponse, receiver_id: UUID) -> None:
        """
        Sends a message to a specified receiver if they are connected.

        Args:
            message (MessageResponse): The message to be sent.
            receiver_id (UUID): The unique identifier of the receiver.
        """
        serialized_message = message.model_dump_json()
        await self.send_message(message=serialized_message, receiver_id=receiver_id)

    async def send_message(self, message: str, receiver_id: UUID) -> None:
        """
        Sends a message to a specific receiver identified by receiver_id.

        Args:
            message (str): The message to be sent.
            receiver_id (UUID): The unique identifier of the receiver.
        """
        receiver = self._active_connections.get(receiver_id)
        if receiver is not None:
            try:    
                await receiver.send_text(message)
            except RuntimeError:
                self.disconnect(receiver_id)


websocket_manager = WebSocketManager()
