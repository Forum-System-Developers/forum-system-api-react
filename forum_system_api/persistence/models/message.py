import uuid
from sqlalchemy import Column, DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from forum_system_api.persistence.database import Base


class Message(Base):
    """
    Represents a message in the forum system.

    Attributes:
        id (UUID): Unique identifier for the message.
        content (str): The content of the message.
        author_id (UUID): Foreign key referencing the user who authored the message.
        conversation_id (UUID): Foreign key referencing the conversation to which the message belongs.
        created_at (datetime): Timestamp when the message was created.

    Relationships:
        author (User): The user who authored the message.
        conversation (Conversation): The conversation to which the message belongs.
    """
    __tablename__ = "messages"

    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True, unique=True, nullable=False)
    content = Column(String, nullable=False)
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("conversations.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    author = relationship("User", back_populates="messages")
    conversation = relationship("Conversation", back_populates="messages")
