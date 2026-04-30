from datetime import datetime

from app.core.db_postgres import SessionLocal
from app.models.opportunity import Opportunity


def insert_sample():
    db = SessionLocal()

    try:
        opportunity = Opportunity(
            portal="test_portal",
            source_posting_id="TEST-001",
            title="Sample RFP Opportunity",
            agency="Test Agency",
            status="open",
            posted_date=datetime.utcnow(),
            due_date=datetime.utcnow(),
            source_url="http://example.com",
            attachments_url="http://example.com/docs",
            row_hash="sample_hash_123",
        )

        db.add(opportunity)
        db.commit()

        print("Sample opportunity inserted")

    except Exception as e:
        db.rollback()
        print("Error:", e)

    finally:
        db.close()


if __name__ == "__main__":
    insert_sample()
