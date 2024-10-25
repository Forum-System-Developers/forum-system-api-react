import unittest
from unittest.mock import MagicMock, patch

from fastapi import HTTPException
from sqlalchemy.orm import Session

from forum_system_api.services.message_service import get_or_create_conversation, send_message
from forum_system_api.persistence.models.user import User
from forum_system_api.persistence.models.conversation import Conversation
from forum_system_api.schemas.message import MessageCreate
from tests.services.test_data import USER_1, USER_2
from tests.services.utils import assert_filter_called_with


class MessageService_Should(unittest.TestCase):

    def setUp(self):
        self.mock_db = MagicMock(spec=Session)
        
        self.sender = User(**USER_1)
        self.receiver = User(**USER_2)
        self.conversation = Conversation(id=1, user1_id=self.sender.id, user2_id=self.receiver.id)
        self.message_data = MessageCreate(content="Hello!", receiver_id=self.receiver.id)

    def test_get_or_create_conversation_existing_conversation(self) -> None:
        # Arrange
        self.mock_db.query.return_value.filter.return_value.first.return_value = self.conversation

        # Act
        result = get_or_create_conversation(self.mock_db, self.sender.id, self.receiver.id)

        # Assert
        self.assertEqual(result, self.conversation)
        assert_filter_called_with(
            self.mock_db.query.return_value,
            ((Conversation.user1_id == self.sender.id) & (Conversation.user2_id == self.receiver.id)) |
            ((Conversation.user1_id == self.receiver.id) & (Conversation.user2_id == self.sender.id))
        )

    def test_get_or_create_conversation_creates_new_conversation(self) -> None:
        # Arrange
        self.mock_db.query.return_value.filter.return_value.first.return_value = None
        self.mock_db.add.return_value = None

        # Act
        result = get_or_create_conversation(self.mock_db, self.sender.id, self.receiver.id)

        # Assert
        self.mock_db.add.assert_called_once_with(result)
        self.mock_db.commit.assert_called_once()
        self.mock_db.refresh.assert_called_once_with(result)
        self.assertEqual(result.user1_id, self.sender.id)
        self.assertEqual(result.user2_id, self.receiver.id)

    def test_send_message_receiver_not_found(self) -> None:
        # Arrange
        self.mock_db.query.return_value.filter.return_value.first.return_value = None

        # Act & Assert
        with self.assertRaises(HTTPException) as exc:
            send_message(self.mock_db, self.message_data, self.sender)

        self.assertEqual(exc.exception.status_code, 404)
        self.assertEqual(exc.exception.detail, "Receiver not found")

    @patch("forum_system_api.services.message_service.get_or_create_conversation")
    def test_send_message_creates_message(self, mock_get_or_create_conversation) -> None:
        # Arrange
        self.mock_db.query.return_value.filter.return_value.first.side_effect = [self.receiver]
        mock_get_or_create_conversation.return_value = self.conversation
        self.mock_db.add.return_value = None

        # Act
        message = send_message(self.mock_db, self.message_data, self.sender)

        # Assert
        self.assertEqual(message.content, self.message_data.content)
        self.assertEqual(message.author_id, self.sender.id)
        assert_filter_called_with(self.mock_db.query.return_value, User.id == self.message_data.receiver_id)

        mock_get_or_create_conversation.assert_called_once_with(self.mock_db, self.sender.id, self.message_data.receiver_id)
        self.mock_db.add.assert_called_once_with(message)
        self.mock_db.commit.assert_called_once()
        self.mock_db.refresh.assert_called_once_with(message)
        