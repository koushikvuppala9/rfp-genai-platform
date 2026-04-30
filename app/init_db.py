from app.core.db_base import Base
from app.core.db_postgres import engine

# import models so SQLAlchemy knows them
from app.models.opportunity import Opportunity  # noqa


def init_db():
    Base.metadata.create_all(bind=engine)
    print("Database tables created")


if __name__ == "__main__":
    init_db()
