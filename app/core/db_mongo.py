from pymongo import MongoClient

from app.core.config import settings

client = MongoClient(settings.mongo_uri, serverSelectionTimeoutMS=3000)

db = client[settings.mongo_db_name]


def get_mongo_db():
    return db


def check_mongo():
    client.admin.command("ping")
    return True
