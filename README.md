# LabelGuard

### AI-Assisted Legal Metrology Compliance Inspection Platform

LabelGuard is an intelligent inspection platform designed to assist Legal Metrology officers in checking packaged commodities against the **Legal Metrology (Packaged Commodities) Rules, 2011**.

It combines guided package-image capture, OCR-based declaration extraction, rule-based compliance verification, evidence-backed findings, inspection records, and officer verification into a single workflow.

> **LabelGuard assists regulatory officers. It does not replace legal authorities or officer judgment.**

---

## 🎯 Problem

Inspecting packaged commodities manually can be time-consuming and error-prone, especially when officers need to verify multiple mandatory declarations across different package surfaces.

Important declarations may be:

- Missing
- Difficult to read
- Present on another package surface
- Incorrectly formatted
- Inconsistent across package views
- Difficult to verify manually

LabelGuard aims to make this process faster, more structured, and evidence-driven.

---

## 💡 Solution

LabelGuard follows an evidence-first inspection workflow:

**Capture → Extract → Understand → Check → Verify → Report**

The system helps an inspection officer:

1. Define the inspection context
2. Capture multiple surfaces of a package
3. Check whether sufficient package coverage exists
4. Extract declarations using OCR
5. Identify legally relevant fields
6. Evaluate applicable Legal Metrology requirements
7. Detect potential non-compliances
8. Review evidence and findings
9. Generate inspection records and reports
10. Maintain an inspection history

---

## 🔍 Key Features

### 1. Guided Multi-Surface Capture

Package information may appear on different surfaces.

LabelGuard supports a guided capture workflow to help officers collect the required package views instead of relying on a single photograph.

### 2. OCR-Assisted Declaration Extraction

The system extracts relevant information from package images, including fields such as:

- Manufacturer / Packer / Importer
- Country of Origin
- Generic Name
- Net Quantity
- Maximum Retail Price (MRP)
- Date-related declarations
- Consumer-care information

### 3. Surface Completeness & Quality Gate

LabelGuard distinguishes between:

- A declaration that is actually missing
- A package surface that has not been captured
- Insufficient or unclear visual evidence

This follows an important principle:

> **Not visible is not the same as missing.**

The system can therefore avoid treating an OCR failure or an uncaptured surface as automatic proof of a legal violation.

### 4. Rule-Based Compliance Verification

Extracted declarations are evaluated against applicable Legal Metrology requirements.

The platform supports versioned rule sets so that compliance checks can be associated with the applicable rule version.

### 5. Cross-View Consistency Checking

Information captured from different package surfaces can be compared to identify inconsistencies such as differences in:

- MRP
- Net quantity
- Product information
- Other declarations

### 6. Human-in-the-Loop Verification

Automated findings are presented as evidence-backed inspection findings for officer review.

The system uses statuses such as:

- **Potential Non-Compliance**
- **Needs Officer Verification**
- **Verified**

LabelGuard is designed to assist the officer rather than make final enforcement decisions automatically.

### 7. E-Commerce Listing Audit

LabelGuard also supports inspection of online product listings.

An officer can review information such as:

- Listing URL
- Product title
- MRP
- Quantity
- Country of Origin
- Best Before / Expiry
- Screenshot evidence

Online listing evidence is treated as supplementary evidence and does not replace physical package verification.

### 8. Evidence-Backed Inspection Records

Inspection evidence can be associated with:

- Inspection ID
- Package surface
- Timestamp
- Extracted information
- Compliance findings

The prototype also includes cryptographic evidence records using **SHA-256** hashing.

### 9. Inspection History

Officers can view previous inspections and their associated:

- Commodity
- Category
- Location
- Date
- Status
- Findings

### 10. Compliance Reports

LabelGuard can generate inspection reports containing compliance findings and supporting evidence.

### 11. Offline Inspection Queue

The system includes an offline inspection workflow for situations where reliable network connectivity is unavailable.

Inspection data can be queued and synchronized when connectivity becomes available.

---

## ⚙️ How LabelGuard Works

```text
             ┌─────────────────────────┐
             │ Package / Online Listing│
             └────────────┬────────────┘
                          │
                          ▼
             ┌─────────────────────────┐
             │ Guided Evidence Capture │
             └────────────┬────────────┘
                          │
                          ▼
             ┌─────────────────────────┐
             │ Surface Completeness    │
             │ & Quality Check         │
             └────────────┬────────────┘
                          │
                          ▼
             ┌─────────────────────────┐
             │ OCR / Data Extraction   │
             └────────────┬────────────┘
                          │
                          ▼
             ┌─────────────────────────┐
             │ Declaration             │
             │ Classification          │
             └────────────┬────────────┘
                          │
                          ▼
             ┌─────────────────────────┐
             │ Legal Metrology         │
             │ Rule Engine             │
             └────────────┬────────────┘
                          │
                          ▼
             ┌─────────────────────────┐
             │ Compliance Findings     │
             └────────────┬────────────┘
                          │
                          ▼
             ┌─────────────────────────┐
             │ Officer Verification    │
             └────────────┬────────────┘
                          │
                          ▼
             ┌─────────────────────────┐
             │ Evidence-backed Report  │
             └─────────────────────────┘
```

---

## 📋 Legal Metrology Scope

LabelGuard is designed around the **Legal Metrology (Packaged Commodities) Rules, 2011**.

The prototype includes checks related to mandatory declarations such as:

- Manufacturer / Packer / Importer
- Country of Origin
- Generic Name
- Net Quantity
- MRP
- Date-related declarations
- Consumer-care information
- Other applicable packaged-commodity declarations

The system uses rule sets to structure these requirements into machine-checkable compliance checks.

---

## ⚠️ Important Scope & Limitation

LabelGuard checks **declared information visible on product packaging**.

It does **not physically measure**:

- Actual product weight
- Actual product volume
- Physical dimensions
- Actual quantity inside the package

For example:

If a package declares:

```text
Net Quantity: 500 g
```

LabelGuard can check whether the declaration **"500 g"** is present and whether the declaration meets the applicable requirements.

It does **not** determine whether the package physically contains exactly 500 g.

Final regulatory decisions remain with the authorized officer and applicable legal authorities.

---

## 🏗️ Project Architecture

```text
                    ┌────────────────────┐
                    │    Inspection      │
                    │      Officer       │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │ LabelGuard Web App │
                    │ React / Vite       │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │ Backend REST APIs  │
                    │ Node.js / Express  │
                    └─────────┬──────────┘
                              │
                ┌─────────────┼─────────────┐
                ▼             ▼             ▼
        ┌────────────┐ ┌────────────┐ ┌─────────────┐
        │ OCR /      │ │ Rule       │ │ Data /      │
        │ Vision     │ │ Engine     │ │ Evidence    │
        │ Pipeline   │ │            │ │ Storage     │
        └────────────┘ └────────────┘ └─────────────┘
```

---

## 🧰 Technology Stack

### Frontend

- React.js
- Vite
- HTML5
- CSS3
- Tailwind CSS

### Backend

- Node.js
- Express.js
- REST APIs

### OCR / Computer Vision

- Python
- PaddleOCR
- OpenCV

### Compliance

- Python Rule Engine
- Legal Metrology Rules Database
- Versioned compliance rule sets

### Database / Storage

- MongoDB
- Evidence and inspection records

### Authentication

- JWT
- Role-Based Access Control (RBAC)

### Development & Testing

- Git
- GitHub
- Postman
- Jest

---

## 📁 Project Structure

```text
LabelGuard/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── public/
│   ├── app.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.*
│
├── ocr/
│   └── OCR / computer vision components
│
├── extra/
│
├── .gitignore
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Python
- MongoDB
- Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/Pratik2451/LabelGuard.git
cd LabelGuard
```

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The Vite development server will provide the local frontend URL.

---

### 3. Backend Setup

Open another terminal:

```bash
cd backend
npm install
```

Create the required environment configuration in:

```text
backend/.env
```

Then start the backend using the project's configured npm script.

---

### 4. OCR Setup

The OCR components are located inside:

```text
ocr/
```

Install the Python dependencies required by the OCR environment before running the OCR services.

---

## 🔐 Security & Evidence Integrity

LabelGuard is designed with evidence integrity in mind.

The prototype includes:

- SHA-256 evidence hashing
- Inspection IDs
- Surface-level evidence records
- Timestamps
- Officer verification
- Role-based access control
- JWT authentication

The objective is to maintain a traceable relationship between an inspection finding and the evidence supporting it.

---

## 👮 Human-in-the-Loop Design

Automation should assist inspection officers, not blindly replace them.

LabelGuard therefore separates:

```text
Automated Detection
        ↓
Potential Finding
        ↓
Evidence Review
        ↓
Officer Verification
        ↓
Inspection Record
```

This helps distinguish between an automated indication and a final regulatory decision.

---

## 📊 Dashboard

The inspection dashboard provides an overview of:

- Total inspections
- Completed / verified inspections
- Inspections needing review
- Potential non-compliances
- Recent inspections
- Frequent statutory findings

This allows officers to manage inspections and review outstanding findings from a centralized interface.

---

## 🧪 Development Principle

LabelGuard follows an API-oriented architecture.

When backend services are unavailable during development, controlled mock data may be used for demonstration purposes.

Mock data should remain isolated from production data and should not be presented as genuine AI analysis.

The frontend is structured around the expectation that real backend services will provide:

- OCR text
- Bounding boxes
- Confidence scores
- Extracted declarations
- Rule results
- Violations
- Recommendations
- Compliance scores

---

## 🎯 Smart India Hackathon

**Problem Statement ID:** 26034

**Problem Statement:**

> Software System to check compliance of Packaged Commodities under Legal Metrology (Packaged Commodities) Rules, 2011 by scanning products, images and labels.

**Theme:** Miscellaneous

**Category:** Software

**Project:** LabelGuard

---

## 🌟 Vision

LabelGuard aims to make packaged-commodity inspections:

**Faster. Evidence-driven. Explainable. Consistent.**

By combining OCR, structured compliance rules, guided evidence capture, inspection history, and human verification, the platform can help modernize the workflow used for packaged-commodity compliance inspections.

---

## 📌 Core Principle

> **Not visible is not the same as missing.**

LabelGuard is built around the idea that compliance decisions should be supported by sufficient evidence rather than being based solely on whether an OCR system could read a particular piece of text.

---

## 👥 Team

### LabelGuard

Built for **Smart India Hackathon 2026**

---

## 📄 Disclaimer

LabelGuard is a technology prototype intended to assist compliance inspection workflows.

It is not a substitute for:

- Legal advice
- Official Legal Metrology authorities
- Authorized inspection officers
- Applicable laws, rules, notifications, or government directions

Final compliance and enforcement decisions must be made by the appropriate authorized authority.

---

## 🔗 Repository

GitHub:

https://github.com/Pratik2451/LabelGuard
