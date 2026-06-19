#!/bin/bash

cd /Users/koushikvuppala/Documents/RFPGenAI_Project || exit 1

source .venv/bin/activate

python -m app.ingestion.run_daily
python -m app.ingestion.send_daily_email
