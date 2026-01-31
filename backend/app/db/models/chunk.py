import uuid
from sqlalchemy import Column, Text, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.types import ARRAY, Float as SAFloat

from app.db.base import Base

class Chunk(Base):
    __tablename__ = "chunks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    file_id = Column(
        UUID(as_uuid=True),
        ForeignKey("files.id", ondelete="CASCADE"),
        nullable=False
    )
    text = Column(Text, nullable=False)
    start_time = Column(Float)
    end_time = Column(Float)
