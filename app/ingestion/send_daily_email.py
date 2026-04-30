from datetime import UTC, date, datetime, time

from sqlalchemy import or_

from app.config.relevance_keywords import BDM_KEYWORDS
from app.core.db_postgres import SessionLocal
from app.models.opportunity import Opportunity
from app.services.email_service import send_email
from app.services.relevance_service import calculate_relevance_score


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

        lines = ["Good Morning,\n", "Today's RFP Inbox:\n"]

        if not scored_items:
            lines.append("No active relevant RFP opportunities found for today.\n")

        for score, item in scored_items:
            lines.append(
   		 f"- {item.title}\n"
   		 f"  Bid / Project ID: {item.source_posting_id}\n"
   		 f"  Agency: {item.agency}\n"
   		 f"  Due: {item.due_date_raw or item.due_date}\n"
   		 f"  Relevance Score: {score}\n"
   		 f"  Link: {item.source_url}\n"
	)

        body = "\n".join(lines)

        send_email(
            subject=f"Daily RFP Inbox - {today}",
            body=body,
            to_emails=["Koushik@eitacies.com"],
        )

        print("Email sent")

    finally:
        db.close()


if __name__ == "__main__":
    run_daily_email()
