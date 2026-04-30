from datetime import datetime
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

SOURCE_URL = "https://www.cincinnati-oh.gov/noncms/cmgr/business-opportunities/"


def fetch_cincinnati_html():
    response = requests.get(SOURCE_URL, timeout=30)
    response.raise_for_status()
    return response.text


def clean_text(value):
    if not value:
        return None
    return " ".join(value.split())


def parse_due_date(value):
    if not value:
        return None

    cleaned = clean_text(value)

    formats = [
        "%m/%d/%Y %I:%M %p",
        "%m/%d/%Y %H:%M",
        "%m/%d/%Y",
    ]

    for fmt in formats:
        try:
            return datetime.strptime(cleaned, fmt)
        except ValueError:
            pass

    return None


def find_attachment_url(row):
    for link in row.find_all("a"):
        href = link.get("href")
        text = clean_text(link.get_text(" ", strip=True)) or ""

        if not href:
            continue

        if "attachment" in text.lower() or "view" in text.lower():
            return urljoin(SOURCE_URL, href)

    return None


def get_cell_map(row):
    cells = row.find_all("td")

    if len(cells) < 8:
        return None

    values = [clean_text(cell.get_text(" ", strip=True)) for cell in cells]

    return {
        "bid_number": values[0],
        "status": values[1],
        "title": values[2],
        "department": values[3] if len(values) > 3 else None,
        "buyer": values[4] if len(values) > 4 else None,
        "procurement_type": values[5] if len(values) > 5 else None,
        "inclusion": values[6] if len(values) > 6 else None,
        "due_date_raw": values[7] if len(values) > 7 else None,
        "awarded_contractor": values[8] if len(values) > 8 else None,
        "attachments_url": find_attachment_url(row),
    }


def parse_cincinnati_opportunities(html):
    soup = BeautifulSoup(html, "html.parser")
    rows = soup.select("table tr")

    items = []

    for row in rows:
        cell_map = get_cell_map(row)

        if not cell_map:
            continue

        bid_number = cell_map["bid_number"]
        status = cell_map["status"]
        title = cell_map["title"]

        if not bid_number or not title or not status:
            continue

        if status.lower() != "accepting bids":
            continue

        items.append(
            {
                "portal": "cincinnati_business_opportunities",
                "source_posting_id": bid_number,
                "title": title,
                "agency": cell_map["department"],
                "status": status,
                "due_date": parse_due_date(cell_map["due_date_raw"]),
                "due_date_raw": cell_map["due_date_raw"],
                "source_url": SOURCE_URL,
                "attachments_url": cell_map["attachments_url"],
            }
        )

    return items


def fetch_cincinnati_opportunities():
    html = fetch_cincinnati_html()
    return parse_cincinnati_opportunities(html)
