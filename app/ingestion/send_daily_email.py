from datetime import UTC, date, datetime, time

from sqlalchemy import or_

from app.config.relevance_keywords import BDM_KEYWORDS
from app.core.db_postgres import SessionLocal
from app.models.opportunity import Opportunity
from app.services.email_service import send_email
from app.services.relevance_service import calculate_relevance_score


def get_change_label(item, start_dt):
    if item.first_seen_at and item.first_seen_at >= start_dt:
        return "NEW"

    if item.last_changed_at and item.last_changed_at >= start_dt:
        return "UPDATED"

    return "ACTIVE"


def format_item(item, score):
    return (
        f"- {item.title}\n"
        f"  Bid / Project ID: {item.source_posting_id}\n"
        f"  Agency: {item.agency}\n"
        f"  Due: {item.due_date_raw or item.due_date}\n"
        f"  Relevance Score: {score}\n"
        f"  Link: {item.source_url}\n"
    )


def run_daily_email():
    db = SessionLocal()

    try:
        today = date.today()
        start_dt = datetime.combine(today, time.min)
        now = datetime.now(UTC).replace(tzinfo=None)

        query = db.query(Opportunity)

        query = query.filter(
            Opportunity.status.ilike("Accepting Bids"),
            or_(
                Opportunity.due_date.is_(None),
                Opportunity.due_date >= now,
            ),
            or_(
                Opportunity.first_seen_at >= start_dt,
                Opportunity.last_changed_at >= start_dt,
            ),
        )

        relevance_filters = [
            Opportunity.title.ilike(f"%{word}%")
            for word in BDM_KEYWORDS
        ]
        query = query.filter(or_(*relevance_filters))

        items = query.order_by(Opportunity.last_changed_at.desc()).limit(20).all()

        scored_items = []
        for item in items:
            score = calculate_relevance_score(item.title)
            if score > 0:
                scored_items.append((score, item))

        scored_items.sort(key=lambda x: x[0], reverse=True)

        new_items = []
        updated_items = []

        for score, item in scored_items:
            label = get_change_label(item, start_dt)
            formatted = format_item(item, score)

            if label == "NEW":
                new_items.append(formatted)
            elif label == "UPDATED":
                updated_items.append(formatted)

        lines = ["Good Morning,\n"]

        if new_items:
            lines.append("NEW Opportunities:\n")
            lines.extend(new_items)

        if updated_items:
            lines.append("\nUPDATED Opportunities:\n")
            lines.extend(updated_items)

        if not new_items and not updated_items:
            lines.append("No new or updated relevant opportunities today.\n")

        lines.append(
            "\n--\n"
            "Thanks & Regards,\n"
            "Koushik Vuppala | Software Developer\n"
            "RFPGenAI Team | EITACIES Inc"
        )

        body = "\n".join(lines)

        send_email(
            subject=f"Daily RFP Inbox - {today}",
            body=body,
            to_emails=["bdm@eitacies.com"],
            cc_emails=["koushik@eitacies.com"],
        )

        print("Email sent")

    finally:
        db.close()


if __name__ == "__main__":
    run_daily_email()
