from datetime import UTC, datetime
from hashlib import sha256

from app.models.opportunity import Opportunity


def build_row_hash(item):
    raw = "|".join([
        item["portal"],
        item["source_posting_id"],
        item["title"],
        item.get("agency") or "",
        item.get("status") or "",
        str(item.get("due_date_raw") or ""),
        item.get("source_url") or "",
        item.get("attachments_url") or "",
    ])
    return sha256(raw.encode("utf-8")).hexdigest()


def upsert_opportunity(db, item):
    now = datetime.now(UTC).replace(tzinfo=None)
    new_hash = build_row_hash(item)

    existing = (
        db.query(Opportunity)
        .filter(
            Opportunity.portal == item["portal"],
            Opportunity.source_posting_id == item["source_posting_id"],
        )
        .first()
    )

    if existing:
        existing.last_seen_at = now

        if existing.row_hash != new_hash:
            existing.title = item["title"]
            existing.agency = item.get("agency")
            existing.status = item.get("status")
            existing.due_date = item.get("due_date")
            existing.due_date_raw = item.get("due_date_raw")
            existing.source_url = item.get("source_url")
            existing.attachments_url = item.get("attachments_url")
            existing.row_hash = new_hash
            existing.last_changed_at = now

            return existing, "updated"

        return existing, "unchanged"

    opportunity = Opportunity(
        portal=item["portal"],
        source_posting_id=item["source_posting_id"],
        title=item["title"],
        agency=item.get("agency"),
        status=item.get("status"),
        due_date=item.get("due_date"),
        due_date_raw=item.get("due_date_raw"),
        source_url=item.get("source_url"),
        attachments_url=item.get("attachments_url"),
        row_hash=new_hash,
        first_seen_at=now,
        last_seen_at=now,
        last_changed_at=now,
    )

    db.add(opportunity)

    return opportunity, "created"
