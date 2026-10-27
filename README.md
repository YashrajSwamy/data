# API Endpoints and Data Collection

## 1. Buddy4Study API

**Base URL**
```text
https://api.buddy4study.com/api/v1.0
```

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/uaa/oauth/token` | Obtain access token |
| POST | `/ssms/scholarship/` | Fetch scholarship listings |
| POST | `/api/scholarships` | Project endpoint for scholarship data |

**Data collected:** Scholarship name, eligibility, benefits, amount, deadline, application link, and required documents where available.

## 2. Vidyasaarathi Web Scraping

**Source:** `https://www.vidyasaarathi.co.in/Vidyasaarathi/scholarship`

| Method | Project Endpoint | Purpose |
|---|---|---|
| GET | `/api/vidyasaarathi` | Extract published scholarship data |

**Data collected:** Scholarship details, application dates, and other available fields. Published schemes are filtered by status and dates.

## 3. National Scholarship Portal (NSP)

**Source:** `https://scholarships.gov.in/All-Scholarships`

| Method | Project Endpoint | Purpose |
|---|---|---|
| GET | `/api/nsp` | Scrape scholarship listings and linked PDFs |

**Data collected:** Scholarship name, logo, application dates, eligibility, scholarship amount, selection criteria, and required documents where available.

## Endpoint Summary

| Source | Method | Endpoint |
|---|---|---|
| Buddy4Study | POST | `/api/scholarships` |
| Vidyasaarathi | GET | `/api/vidyasaarathi` |
| NSP | GET | `/api/nsp` |

**Technologies:** Node.js, Express, Cheerio, and `pdf-parse`.
