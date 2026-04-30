from app.core.db_postgres import SessionLocal
from app.ingestion.portal_registry import ENABLED_PORTALS
from app.services.opportunity_service import upsert_opportunity


def run_daily_ingestion():
    db = SessionLocal()

    total_counts = {
        "portals": 0,
        "fetched": 0,
        "created": 0,
        "updated": 0,
        "unchanged": 0,
        "failed": 0,
    }

    try:
        for portal in ENABLED_PORTALS:
            portal_name = portal["name"]
            fetcher = portal["fetcher"]

            print(f"Running portal: {portal_name}")

            try:
                items = fetcher()
                total_counts["portals"] += 1
                total_counts["fetched"] += len(items)

                for item in items:
                    try:
                        _, action = upsert_opportunity(db, item)
                        total_counts[action] += 1
                    except Exception as e:
                        total_counts["failed"] += 1
                        print(f"Failed item {item.get('source_posting_id')}: {e}")

                db.commit()

            except Exception as e:
                db.rollback()
                total_counts["failed"] += 1
                print(f"Portal failed: {portal_name} - {e}")

    finally:
        db.close()

    print("Daily ingestion complete")
    print(total_counts)


if __name__ == "__main__":
    run_daily_ingestion()
