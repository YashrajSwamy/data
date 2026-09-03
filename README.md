# API Endpoints

### Base URL

```text
https://api.buddy4study.com/api/v1.0
```

---

## 1. Authentication

Used to obtain an access token for authenticated API requests.

**Endpoint**

```http
POST /uaa/oauth/token
```

**Headers**

```http
Authorization: Basic <credentials>
Accept: application/json, text/plain, */*
```

**Request Body**

```text
grant_type=client_credentials
portalId=1
```

The request uses `application/x-www-form-urlencoded` data.

**Response**

The response contains an `access_token`, which is used as a Bearer token for subsequent requests.

```http
Authorization: Bearer <access_token>
```

---

## 2. Scholarship Listing

Returns a list of open scholarships filtered and sorted by deadline.

**Endpoint**

```http
POST /ssms/scholarship/
```

**Headers**

```http
Accept: application/json
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body**

```json
{
  "page": 0,
  "length": 100,
  "rules": [
    {
      "rule": [22]
    },
    {
      "rule": [260, 282, 254, 288]
    },
    {
      "rule": [820]
    }
  ],
  "mode": "OPEN",
  "sortOrder": "DEADLINE"
}
```

**Response**

The scholarship records are extracted from:

```text
data.scholarships
```

Each record contains information such as:

```text
scholarshipName
slug
```

The `slug` is used to request detailed information for an individual scholarship.

---

## 3. Featured Scholarships

Returns scholarships marked as featured.

**Endpoint**

```http
GET /ssms/scholarship?featured=true
```

**Headers**

```http
Accept: application/json
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Query Parameter**

| Parameter  | Value  | Description                                  |
| ---------- | ------ | -------------------------------------------- |
| `featured` | `true` | Filters the results to featured scholarships |

The complete API response is returned and can be processed to extract the required scholarship information.

---

## 4. Scholarship Details

Returns detailed information for a scholarship identified by its slug.

**Endpoint**

```http
GET /ssms/scholarship-detail/{slug}
```

**Example**

```http
GET /ssms/scholarship-detail/kotak-kanya-scholarship
```

**Headers**

```http
Accept: application/json
Authorization: Bearer <access_token>
Origin: https://www.buddy4study.com
Referer: https://www.buddy4study.com/
```

Other browser-related headers may be included when making the request from a browser environment.

### Response Data

The required scholarship object is extracted from:

```text
data.brandPage.scholarships[0]
```

The project maps the API response into the following structure:

| Project Field   | API Field          | Description                            |
| --------------- | ------------------ | -------------------------------------- |
| `title`         | `title`            | Scholarship name                       |
| `logoUrl`       | `logoUrl`          | Scholarship logo                       |
| `eligibility`   | `eligibility`      | Eligibility criteria                   |
| `applicableFor` | `applicableFor`    | Applicable student/category            |
| `benefits`      | `benefits`         | Scholarship benefits                   |
| `amount`        | `purposeAward`     | Award/financial assistance information |
| `deadline`      | `deadline`         | Application deadline                   |
| `deadlineLeft`  | `deadlineDateDiff` | Time remaining until deadline          |
| `applyLink`     | `applyLink`        | Application URL                        |
| `requiredDoc`   | `requiredDocument` | Required documents                     |

### Example Output

```json
{
  "title": "Kotak Kanya Scholarship",
  "logoUrl": "...",
  "eligibility": "...",
  "applicableFor": "...",
  "benefits": "...",
  "amount": "...",
  "deadline": "...",
  "deadlineLeft": "...",
  "applyLink": "...",
  "requiredDoc": "..."
}
```

---

## Endpoint Summary

| Purpose               | Method | Endpoint                          | Authentication |
| --------------------- | ------ | --------------------------------- | -------------- |
| Authentication        | `POST` | `/uaa/oauth/token`                | Basic          |
| Scholarship Listing   | `POST` | `/ssms/scholarship/`              | Bearer         |
| Featured Scholarships | `GET`  | `/ssms/scholarship?featured=true` | Bearer         |
| Scholarship Details   | `GET`  | `/ssms/scholarship-detail/{slug}` | Bearer         |
