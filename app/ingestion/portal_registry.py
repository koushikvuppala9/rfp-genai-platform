from app.ingestion.sources.cincinnati import fetch_cincinnati_opportunities


ENABLED_PORTALS = [
    {
        "name": "cincinnati_business_opportunities",
        "fetcher": fetch_cincinnati_opportunities,
    },
]
