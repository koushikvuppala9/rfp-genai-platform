VENV = source .venv/bin/activate

run:
	$(VENV) && python -m uvicorn app.main:app --reload

ingest:
	$(VENV) && python -m app.ingestion.run_daily

inbox:
	@echo "Open:"
	@echo "http://127.0.0.1:8000/opportunities/daily-inbox"

health:
	@echo "Open:"
	@echo "http://127.0.0.1:8000/health"

test-score: 
	$(VENV) && python -c "from app.services.relevance_service import calculate_relevance_score; print(calculate_relevance_score('ERP and HCM System Replacement'))"


	