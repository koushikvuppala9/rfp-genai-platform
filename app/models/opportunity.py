from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, Text, UniqueConstraint

from app.core.db_base import Base


class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(Integer, primary_key=True, index=True)

    portal = Column(String(100), nullable=False)
    source_posting_id = Column(String(255), nullable=False)

    title = Column(Text, nullable=False)
    agency = Column(String(255), nullable=True)
    status = Column(String(100), nullable=True)

    posted_date = Column(DateTime, nullable=True)
    due_date = Column(DateTime, nullable=True)
    due_date_raw = Column(String(100), nullable=True)

    source_url = Column(Text, nullable=True)
    attachments_url = Column(Text, nullable=True)

    row_hash = Column(String(64), nullable=False)

    first_seen_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    last_seen_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    last_changed_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint("portal", "source_posting_id", name="uq_opportunity_portal_source"),
    )
