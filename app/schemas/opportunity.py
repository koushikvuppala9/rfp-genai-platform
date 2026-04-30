from datetime import datetime

from pydantic import BaseModel


class OpportunityCreate(BaseModel):
    portal: str
    source_posting_id: str
    title: str
    agency: str | None = None
    status: str | None = None
    source_url: str | None = None
    attachments_url: str | None = None


class OpportunityResponse(BaseModel):
    id: int
    portal: str
    source_posting_id: str
    title: str
    agency: str | None = None
    status: str | None = None
    posted_date: datetime | None = None
    due_date: datetime | None = None
    source_url: str | None = None
    attachments_url: str | None = None
    first_seen_at: datetime
    last_seen_at: datetime
    last_changed_at: datetime

    model_config = {
        "from_attributes": True
    }


class OpportunityUpsertResponse(BaseModel):
    id: int
    action: str
    message: str
