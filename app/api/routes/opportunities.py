from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.db_postgres import get_db
from app.models.opportunity import Opportunity
from app.schemas.opportunity import (
    OpportunityCreate,
    OpportunityResponse,
    OpportunityUpsertResponse,
)
from app.services.opportunity_service import upsert_opportunity

router = APIRouter(prefix="/opportunities", tags=["opportunities"])


@router.get("", response_model=list[OpportunityResponse])
def list_opportunities(
    portal: str | None = None,
    status: str | None = None,
    keyword: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(Opportunity)

    if portal:
        query = query.filter(Opportunity.portal == portal)

    if status:
        query = query.filter(Opportunity.status == status)

    if keyword:
        search_term = f"%{keyword}%"
        query = query.filter(Opportunity.title.ilike(search_term))

    return (
        query.order_by(Opportunity.id.desc())
        .limit(100)
        .all()
    )


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
