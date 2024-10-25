from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from forum_system_api.persistence.models.reply import Reply
from forum_system_api.persistence.models.reply_reaction import ReplyReaction
from forum_system_api.persistence.models.topic import Topic
from forum_system_api.persistence.models.user import User
from forum_system_api.schemas.reply import ReplyCreate, ReplyReactionCreate, ReplyUpdate
from forum_system_api.services.user_service import is_admin
from forum_system_api.services.utils.category_access_utils import (
    verify_topic_permission,
)


def get_by_id(user: User, reply_id: UUID, db: Session) -> Reply:
    """
    Retrieve a reply by its ID.

    Args:
        user (User): The user requesting the reply.
        reply_id (UUID): The unique identifier of the reply.
        db (Session): The database session.
    Returns:
        Reply: The reply object if found.
    Raises:
        HTTPException: If the reply is not found or the user does not have permission to access the topic.
    """

    from forum_system_api.services import topic_service

    reply = db.query(Reply).filter(Reply.id == reply_id).first()
    if reply is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Reply not found"
        )
    verify_topic_permission(
        topic=topic_service.get_by_id(topic_id=reply.topic_id, user=user, db=db),
        user=user,
        db=db,
    )

    return reply


def create(topic_id: UUID, reply: ReplyCreate, user: User, db: Session) -> Reply:
    """
    Create a new reply for a given topic.

    Args:
        topic_id (UUID): The unique identifier of the topic to which the reply is being added.
        reply (ReplyCreate): The data required to create a new reply.
        user (User): The user creating the reply.
        db (Session): The database session used for the operation.
    Returns:
        Reply: The newly created reply object.
    Raises:
        HTTPException: If the user does not have permission to reply to the topic.
    """

    topic = _validate_reply_access(topic_id=topic_id, user=user, db=db)
    verify_topic_permission(topic=topic, user=user, db=db)

    new_reply = Reply(topic_id=topic_id, author_id=user.id, **reply.model_dump())
    db.add(new_reply)
    db.commit()
    db.refresh(new_reply)
    return new_reply


def update(
    user: User, reply_id: UUID, updated_reply: ReplyUpdate, db: Session
) -> Reply:
    """
    Update an existing reply.

    Args:
        user (User): The user attempting to update the reply.
        reply_id (UUID): The unique identifier of the reply to be updated.
        updated_reply (ReplyUpdate): The new data for the reply.
        db (Session): The database session.
    Returns:
        Reply: The updated reply.
    Raises:
        HTTPException: If the user does not have permission to update the reply.
    """

    existing_reply = get_by_id(user=user, reply_id=reply_id, db=db)
    topic = _validate_reply_access(topic_id=existing_reply.topic_id, user=user, db=db)
    verify_topic_permission(topic=topic, user=user, db=db)

    if user.id != existing_reply.author_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Cannot update reply"
        )

    if updated_reply.content:
        existing_reply.content = updated_reply.content
        db.commit()
        db.refresh(existing_reply)

    return existing_reply


def vote(
    reply_id: UUID, reaction: ReplyReactionCreate, user: User, db: Session
) -> Reply:
    """
    Casts a vote on a reply. If the user has already voted with a different reaction,
    the reaction is updated. If the user has already voted with the same reaction,
    the vote is removed. If the user has not voted yet, a new vote is created.

    Args:
        reply_id (UUID): The ID of the reply to vote on.
        reaction (ReplyReactionCreate): The reaction to cast.
        user (User): The user casting the vote.
        db (Session): The database session.
    Returns:
        Reply: The updated reply after the vote has been cast.
    """

    reply = get_by_id(user=user, reply_id=reply_id, db=db)

    existing_vote = _get_vote_by_id(reply_id=reply_id, user_id=user.id, db=db)
    if existing_vote is None:
        return create_vote(user_id=user.id, reply=reply, reaction=reaction, db=db)

    if existing_vote.reaction != reaction.reaction:
        existing_vote.reaction = reaction.reaction
        db.commit()
    else:
        db.delete(existing_vote)
        db.commit()

    db.refresh(reply)
    return reply


def create_vote(
    user_id: UUID, reply: Reply, reaction: ReplyReactionCreate, db: Session
) -> Reply:
    """
    Create a vote for a reply.

    Args:
        user_id (UUID): The ID of the user creating the vote.
        reply (Reply): The reply object to which the vote is being added.
        reaction (ReplyReactionCreate): The reaction details for the vote.
        db (Session): The database session to use for the operation.

    Returns:
        Reply: The updated reply object after the vote has been added.
    """

    user_vote = ReplyReaction(
        user_id=user_id, reply_id=reply.id, **reaction.model_dump()
    )
    db.add(user_vote)
    db.commit()
    db.refresh(reply)
    return reply


def _get_vote_by_id(reply_id: UUID, user_id: UUID, db: Session) -> ReplyReaction | None:
    """
    Retrieve a vote (reaction) for a specific reply by a specific user.

    Args:
        reply_id (UUID): The unique identifier of the reply.
        user_id (UUID): The unique identifier of the user.
        db (Session): The database session used for querying.

    Returns:
        ReplyReaction | None: The existing vote (reaction) if found, otherwise None.
    """

    existing_vote = (
        db.query(ReplyReaction).filter_by(user_id=user_id, reply_id=reply_id).first()
    )
    return existing_vote


def get_votes(reply: Reply):
    """
    Calculate the number of upvotes and downvotes for a given reply.

    Args:
        reply (Reply): The reply object containing reactions.

    Returns:
        tuple: A tuple containing the number of upvotes and downvotes.
    """

    upvotes = sum(1 for reaction in reply.reactions if reaction.reaction)
    downvotes = sum(1 for reaction in reply.reactions if not reaction.reaction)
    return (upvotes, downvotes)


def _validate_reply_access(topic_id: UUID, user: User, db: Session) -> Topic:
    """
    Validates if a user has access to reply to a topic.
    This function checks if the topic is locked and if the user is an admin.
    If the topic is locked and the user is not an admin, an HTTP 403 Forbidden
    exception is raised.

    Args:
        topic_id (UUID): The unique identifier of the topic.
        user (User): The user attempting to reply to the topic.
        db (Session): The database session.
    Returns:
        Topic: The topic object if access is validated.
    Raises:
        HTTPException: If the topic is locked and the user is not an admin.
    """

    from forum_system_api.services.topic_service import get_by_id as get_topic_by_id

    topic = get_topic_by_id(topic_id=topic_id, user=user, db=db)
    if topic.is_locked and not is_admin(user_id=user.id, db=db):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Topic is locked"
        )

    return topic
