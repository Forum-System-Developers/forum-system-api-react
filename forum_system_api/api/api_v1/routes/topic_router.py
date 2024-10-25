from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from forum_system_api.persistence.database import get_db
from forum_system_api.persistence.models.user import User
from forum_system_api.schemas.common import TopicFilterParams
from forum_system_api.schemas.topic import (
    TopicCreate,
    TopicResponse,
    TopicUpdate,
)
from forum_system_api.services import topic_service
from forum_system_api.services.auth_service import get_current_user, require_admin_role

topic_router = APIRouter(prefix="/topics", tags=["topics"])


@topic_router.get(
    "/public",
    response_model=list[TopicResponse],
    status_code=200,
    description="Get a list of all topics along with their replies for public access",
)
def get_public(db=Depends(get_db)) -> list[TopicResponse]:
    topics = topic_service.get_public(db=db)
    return [
        TopicResponse.create(
            topic=topic,
            replies=topic_service.get_replies(topic_id=topic.id, db=db),
        )
        for topic in topics
    ]


@topic_router.get(
    "/",
    response_model=list[TopicResponse],
    status_code=200,
    description="Get a list of all topics along with their replies",
)
def get_all(
    filter_query: TopicFilterParams = Depends(),
    db=Depends(get_db),
    user: User = Depends(get_current_user),
) -> list[TopicResponse]:
    topics = topic_service.get_all(filter_params=filter_query, user=user, db=db)
    return [
        TopicResponse.create(
            topic=topic,
            replies=topic_service.get_replies(topic_id=topic.id, db=db),
        )
        for topic in topics
    ]


@topic_router.get(
    "/{topic_id}",
    response_model=TopicResponse,
    status_code=200,
    description="Get a topic by its ID along with its replies",
)
def get_by_id(
    topic_id: UUID,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> TopicResponse:
    topic = topic_service.get_by_id(topic_id=topic_id, user=user, db=db)
    return TopicResponse.create(
        topic=topic,
        replies=topic_service.get_replies(topic_id=topic.id, db=db),
    )


@topic_router.post(
    "/", response_model=TopicResponse, status_code=201, description="Create a new topic"
)
def create(
    topic: TopicCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TopicResponse:
    topic = topic_service.create(topic=topic, user=user, db=db)
    return TopicResponse.create(topic=topic, replies=[])


@topic_router.put(
    "/{topic_id}",
    response_model=TopicResponse,
    status_code=200,
    description="Update a topic. You're able to update the title, or assign it to a different category",
)
def update(
    topic_id: UUID,
    updated_topic: TopicUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TopicResponse:
    topic = topic_service.update(
        user=user, topic_id=topic_id, updated_topic=updated_topic, db=db
    )
    return TopicResponse.create(
        topic=topic,
        replies=topic_service.get_replies(topic_id=topic.id, db=db),
    )


@topic_router.patch(
    "/{topic_id}/lock",
    status_code=200,
    description="Admin can Lock or Unlock a topic",
)
def lock(
    topic_id: UUID,
    lock_topic: bool = Query(default=True),
    admin: User = Depends(require_admin_role),
    db: Session = Depends(get_db),
) -> dict:
    topic = topic_service.lock(
        user=admin, topic_id=topic_id, lock_topic=lock_topic, db=db
    )
    return {"msg": "Topic locked"} if topic.is_locked else {"msg": "Topic unlocked"}


@topic_router.patch(
    "/{topic_id}/replies/{reply_id}/best",
    response_model=TopicResponse,
    status_code=200,
    description="Select the best reply for a topic. Only the author of the topic can select the best reply",
)
def best_reply(
    topic_id: UUID,
    reply_id: UUID,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TopicResponse:
    topic = topic_service.select_best_reply(
        user=user, topic_id=topic_id, reply_id=reply_id, db=db
    )
    return TopicResponse.create(
        topic=topic, replies=topic_service.get_replies(topic_id=topic.id, db=db)
    )
