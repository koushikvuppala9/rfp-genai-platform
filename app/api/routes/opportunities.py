from datetime import date, datetime, time

from fastapi import APIRouter, Depends
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.config.relevance_keywords import BDM_KEYWORDS
from app.core.db_postgres import get_db
from app.models.opportunity import Opportunity
from app.schemas.opportunity import (
    OpportunityCreate,
    OpportunityListResponse,
    OpportunityUpsertResponse,
)
from app.services.opportunity_service import upsert_opportunity
from app.services.relevance_service import calculate_relevance_score

router = APIRouter(prefix="/opportunities", tags=["opportunities"])


@router.get("", response_model=OpportunityListResponse)
def list_opportunities(
    portal: str | None = None,
    status: str | None = None,
    keyword: str | None = None,
    new_since: date | None = None,
    changed_since: date | None = None,
    only_open: bool = False,
    relevant_only: bool = False,
    page: int = 1,
    size: int = 20,
    sort: str = "id_desc",
    db: Session = Depends(get_db),
):
    if page < 1:
        page = 1

    if size < 1:
        size = 20

    if size > 100:
        size = 100

    query = db.query(Opportunity)

    if portal:
        query = query.filter(Opportunity.portal == portal)

    if status:
        query = query.filter(Opportunity.status == status)

    if keyword:
        search_term = f"%{keyword}%"
        query = query.filter(Opportunity.title.ilike(search_term))

    if relevant_only:
        relevance_filters = [
            Opportunity.title.ilike(f"%{word}%")
            for word in BDM_KEYWORDS
        ]
        query = query.filter(or_(*relevance_filters))

    if new_since:
        start_dt = datetime.combine(new_since, time.min)
        query = query.filter(Opportunity.first_seen_at >= start_dt)

    if changed_since:
        start_dt = datetime.combine(changed_since, time.min)
        query = query.filter(Opportunity.last_changed_at >= start_dt)

    if only_open:
        now = datetime.utcnow()
        query = query.filter(
            Opportunity.status.ilike("Accepting Bids"),
            or_(
                Opportunity.due_date.is_(None),
                Opportunity.due_date >= now,
            ),
        )

    total = query.count()

    if sort == "id_asc":
        query = query.order_by(Opportunity.id.asc())
    elif sort == "last_seen_desc":
        query = query.order_by(Opportunity.last_seen_at.desc())
    elif sort == "last_changed_desc":
        query = query.order_by(Opportunity.last_changed_at.desc())
    else:
        query = query.order_by(Opportunity.id.desc())

    offset = (page - 1) * size
    items = query.offset(offset).limit(size).all()

    # ---- THIS IS THE IMPORTANT PART ----
    response_items = []

    for item in items:
        response_items.append({
            "id": item.id,
            "portal": item.portal,
            "source_posting_id": item.source_posting_id,
            "title": item.title,
            "agency": item.agency,
            "status": item.status,
            "posted_date": item.posted_date,
            "due_date": item.due_date,
            "due_date_raw": item.due_date_raw,
            "source_url": item.source_url,
            "attachments_url": item.attachments_url,
            "first_seen_at": item.first_seen_at,
            "last_seen_at": item.last_seen_at,
            "last_changed_at": item.last_changed_at,
            "relevance_score": calculate_relevance_score(item.title),
        })

    return {
        "page": page,
        "size": size,
        "total": total,
        "items": response_items,
    }


@router.post("", response_model=OpportunityUpsertResponse)
def create_or_update_opportunity(
    payload: OpportunityCreate,
    db: Session = Depends(get_db),
):
    opportunity, action = upsert_opportunity(db, payload.model_dump())

    db.commit()
    db.refresh(opportunity)

    return {
        "id": opportunity.id,
        "action": action,
        "message": f"Opportunity {action}",
    }
