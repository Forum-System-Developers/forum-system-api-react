from faker import Faker
from forum_system_api.persistence.database import get_db
from forum_system_api.persistence.models.access_level import AccessLevel
from forum_system_api.persistence.models.user import User
from forum_system_api.schemas.category_permission import UserCategoryPermissionResponse
from forum_system_api.persistence.models.admin import Admin
from forum_system_api.persistence.models.category import Category
from forum_system_api.persistence.models.conversation import Conversation
from forum_system_api.persistence.models.message import Message
from forum_system_api.persistence.models.reply_reaction import ReplyReaction
from forum_system_api.persistence.models.reply import Reply
from forum_system_api.persistence.models.topic import Topic

fake = Faker()


def fake_category(db, value):
    for _ in range(value):
        category = Category(
            name=fake.word(),
            is_private=fake.boolean(),
            is_locked=fake.boolean(),
        )
        db.add(category)
    db.commit()


def main():
    db = next(get_db())
    try:
        fake_category(db, 10)
    finally:
        db.close()


main()
