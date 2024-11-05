from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from forum_system_api.persistence.database import get_db
from forum_system_api.persistence.models.user import User
from forum_system_api.schemas.message import MessageCreate, MessageResponse
from forum_system_api.services.message_service import send_message
from forum_system_api.services.auth_service import get_current_user
from forum_system_api.services.websocket_manager import websocket_manager
from forum_system_api.services import user_service


message_router = APIRouter(prefix="/messages", tags=["messages"])


@message_router.post(
        "/", 
        response_model=MessageResponse, 
        status_code=201, 
        description="Send a message"
)
async def create_message(
    message_data: MessageCreate, 
    user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
) -> MessageResponse:
    message = send_message(db=db, message_data=message_data, user=user)
    await websocket_manager.send_message_as_json(
        message=MessageResponse.model_validate(message), 
        receiver_id=message_data.receiver_id
    )

    return message


@message_router.get(
        "/{receiver_id}",
        response_model=list[MessageResponse], 
        description="Read a message"
)
def get_messages(
    receiver_id: UUID, 
    user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
) -> list[MessageResponse]:
    receiver = user_service.get_by_id(user_id=receiver_id, db=db)
    if receiver is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    conversation = next(
        (
            conversation 
            for conversation in user.conversations 
            if conversation.user1_id == receiver_id or conversation.user2_id == receiver_id
        ), 
        None
    )

    if conversation is None:
        return []
    
    return conversation.messages
