from app.core.db_postgres import SessionLocal
from app.ingestion.sources.cincinnati import fetch_cincinnati_opportunities
from app.services.opportunity_service import upsert_opportunity


def run_cincinnati():
    db = SessionLocal()

    counts = {
        "fetched": 0,
        "created": 0,
        "updated": 0,
        "unchanged": 0,
        "failed": 0,
    }

    try:
        items = fetch_cincinnati_opportunities()
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
        print("Cincinnati ingestion failed:", e)

    finally:
        db.close()

    print("Cincinnati ingestion complete")
    print(counts)


if __name__ == "__main__":
    run_cincinnati()
