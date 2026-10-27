
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const cheerio = require("cheerio");
const pdfParse = require("pdf-parse");

const app = express();
const token = fs.readFileSync("token.json", "utf8").trim();

app.use(cors());

// 1. Buddy4Study API
app.get("/api/scholarships/buddy4study", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.buddy4study.com/api/v1.0/ssms/scholarship/",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          page: 0,
          length: 100,
          rules: [
            { rule: [22] },
            { rule: [260, 282, 254, 288] },
            { rule: [820] }
          ],
          mode: "OPEN",
          sortOrder: "DEADLINE"
        })
      }
    );

    if (!response.ok) throw new Error("Buddy4Study request failed");

    res.json(await response.json());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 2. Vidyasaarathi Web Scraping
app.get("/api/scholarships/vidyasaarathi", async (req, res) => {
  try {
    const response = await fetch(
      "https://www.vidyasaarathi.co.in/Vidyasaarathi/scholarship",
      {
        headers: { "User-Agent": "Mozilla/5.0" },
        signal: AbortSignal.timeout(30000)
      }
    );

    if (!response.ok) throw new Error("Vidyasaarathi request failed");

    const html = await response.text();
    const match = html.match(/var a=(\[[\s\S]*?\]);/);

    if (!match) throw new Error("Scholarship data not found");

    const data = JSON.parse(match[1]);

    function parseDate(value) {
      if (!value) return null;

      const [day, month, year] = value.split("/").map(Number);
      const date = new Date(year, month - 1, day);

      if (
        date.getDate() !== day ||
        date.getMonth() !== month - 1 ||
        date.getFullYear() !== year
      ) return null;

      date.setHours(0, 0, 0, 0);
      return date;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const scholarships = data
      .filter(s => {
        if (s.smSchemePublishedFlag !== "Y") return false;
        if (s.smSchemeClosed === "Y") return false;

        const start = parseDate(s.smSchemeStartDate);
        const end = parseDate(s.smSchemeEndDate);

        return (!start || today >= start) && (!end || today <= end);
      })
      .map(s => ({
        id: s.smSchemeId,
        name: s.smScholarshipName,
        provider: s.smEntityName,
        amount: s.smScholarshipAmount,
        start_date: s.smSchemeStartDate,
        end_date: s.smSchemeEndDate,
        description: s.smScholarshipDesc,
        eligibility: s.smSchemeEducationCriteria,
        state_criteria: s.smSchemeStateCriteria,
        course_details: s.smCourseDetails,
        published: s.smSchemePublishedFlag
      }));

    res.json({
      source: "Vidyasaarathi",
      total: scholarships.length,
      scholarships
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Extract a section from the Specifications PDF
function getSection(text, startHeading, endHeading) {
  const upper = text.toUpperCase();
  const start = upper.indexOf(startHeading);

  if (start === -1) return "";

  const contentStart = start + startHeading.length;
  const end = endHeading
    ? upper.indexOf(endHeading, contentStart)
    : -1;

  return text
    .slice(contentStart, end === -1 ? undefined : end)
    .replace(/\s+/g, " ")
    .trim();
}


// Download and read a PDF
async function readPDF(url) {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(30000)
    });

    if (!response.ok) return "";

    const buffer = Buffer.from(await response.arrayBuffer());
    const result = await pdfParse(buffer);

    return result.text;
  } catch {
    return "";
  }
}


// 3. National Scholarship Portal (NSP)
app.get("/api/scholarships/nsp", async (req, res) => {
  try {
    const response = await fetch(
      "https://scholarships.gov.in/All-Scholarships",
      {
        headers: { "User-Agent": "Mozilla/5.0" },
        signal: AbortSignal.timeout(30000)
      }
    );

    if (!response.ok) throw new Error("NSP request failed");

    const html = await response.text();
    const $ = cheerio.load(html);
    const scholarships = [];

    $(".accordion-body .row.mb-4").each((i, element) => {
      const card = $(element);
      const name = card.find("h6").first().text().trim();

      if (!name) return;

      const scholarship = {
        name,
        provider: name.includes("AICTE")
          ? "All India Council for Technical Education"
          : "",
        logo: card.find("img").first().attr("src") || "",
        scheme_open_date: "",
        application_deadline: "",
        defective_verification_deadline: "",
        institute_verification_deadline: "",
        dno_verification_deadline: "",
        specifications: "",
        faq: ""
      };

      card.find("span").each((i, span) => {
        const text = $(span).text().trim();
        const value = text.split(":").pop().trim();

        if (text.includes("Scheme") && text.includes("Open from")) {
          scholarship.scheme_open_date = value;
        } else if (text.includes("Student Application")) {
          scholarship.application_deadline = value;
        } else if (text.includes("Defective Application")) {
          scholarship.defective_verification_deadline = value;
        } else if (text.includes("Institute Verification")) {
          scholarship.institute_verification_deadline = value;
        } else if (text.includes("DNO/SNO/MNO")) {
          scholarship.dno_verification_deadline = value;
        }
      });

      card.find("a").each((i, link) => {
        const label = $(link).text().trim().toLowerCase();
        const href = $(link).attr("href");

        if (!href) return;

        const url = new URL(href, "https://scholarships.gov.in").href;

        if (label === "specifications") scholarship.specifications = url;
        if (label === "faq") scholarship.faq = url;
      });

      if (scholarship.logo) {
        scholarship.logo = new URL(
          scholarship.logo,
          "https://scholarships.gov.in"
        ).href;
      }

      scholarships.push(scholarship);
    });

    const detailed = await Promise.all(
      scholarships.map(async s => {
        const pdf = s.specifications
          ? await readPDF(s.specifications)
          : "";

        return {
          ...s,
          eligibility: getSection(
            pdf,
            "2.0 ELIGIBILITY FOR SCHOLARSHIP:",
            "3.0 NUMBER OF SCHOLARSHIPS:"
          ),
          amount: getSection(
            pdf,
            "4.0 AMOUNT OF SCHOLARSHIP:",
            "5.0 CRITERIA OF SELECTION:"
          ),
          selection_criteria: getSection(
            pdf,
            "5.0 CRITERIA OF SELECTION:",
            "6.0 RESERVATION:"
          ),
          documents_required: getSection(
            pdf,
            "10.0 DOCUMENTS TO BE UPLOADED ON NATIONAL SCHOLARSHIP PORTAL:",
            "11.0 TERMS AND CONDITIONS:"
          )
        };
      })
    );

    res.json({
      source: "National Scholarship Portal",
      total: detailed.length,
      scholarships: detailed
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});