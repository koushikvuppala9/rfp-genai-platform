# RFP GenAI Platform

Internal enterprise workflow automation platform for RFP opportunity ingestion, tracking, deduplication, and dashboard APIs.

## Current Scope

This phase includes:

- FastAPI backend
- PostgreSQL database
- MongoDB connection
- Redis connection
- Docker Compose local infra
- Health check API
- Opportunity model
- Opportunity GET API
- Opportunity POST upsert API
- Deduplication by portal + source posting ID
- Change tracking using row hash
- Mock ingestion script

## Local Setup

### 1. Go to project folder

```bash
cd ~/Documents/RFPGenAI_Project
