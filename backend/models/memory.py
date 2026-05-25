from sqlalchemy import Column, Integer, String, Text, DateTime
from database import Base
from datetime import datetime

class Memory(Base):

    __tablename__="memory"

    id=Column(Integer,primary_key=True)

    user_id=Column(String)

    category=Column(String)

    content=Column(Text)

    importance=Column(
        Integer,
        default=5
    )

    frequency=Column(
        Integer,
        default=1
    )

    confidence=Column(
        Integer,
        default=8
    )

    last_accessed=Column(
        DateTime,
        default=datetime.utcnow
    )
