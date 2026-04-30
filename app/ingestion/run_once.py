from app.core.db_postgres import SessionLocal
from app.services.opportunity_service import upsert_opportunity


def get_mock_opportunities():
    return [
        {
            "portal": "mock_portal",
            "source_posting_id": "MOCK-001",
            "title": "Cloud Migration Support Services",
            "agency": "City Procurement Office",
            "status": "open",
            "source_url": "https://example.com/mock-001",
            "attachments_url": "https://example.com/mock-001/docs",
        },
        {
            "portal": "mock_portal",
            "source_posting_id": "MOCK-002",
            "title": "Application Development and Maintenance Services",
            "agency": "State Technology Department",
            "status": "open",
            "source_url": "https://example.com/mock-002",
            "attachments_url": "https://example.com/mock-002/docs",
        },
    ]


def run_once():
    db = SessionLocal()

    counts = {
        "fetched": 0,
        "created": 0,
        "updated": 0,
        "unchanged": 0,
        "failed": 0,
    }

    try:
        items = get_mock_opportunities()
        counts["fetched"] = len(items)

        for item in items:
            try:
                _, action = upsert_opportunity(db, item)
                counts[action] += 1
            except Exception as e:
                counts["failed"] += 1
                print(f"Failed item {item.get('source_posting_id')}: {e}")

        db.commit()

    except Exception as e:
        db.rollback()
        print("Ingestion failed:", e)

    finally:
        db.close()

    print("Ingestion run complete")
    print(counts)


if __name__ == "__main__":
    run_once()
