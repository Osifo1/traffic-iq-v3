# 🚦 TrafficIQ V3 — Edo State Traffic Intelligence System

A smart traffic management platform built for the **Edo State Traffic Management Authority (EDSTMA)**, Benin City, Nigeria. TrafficIQ V3 is the most advanced version of the system, featuring role-based access control, full incident lifecycle management, repeat offender profiling, predictive traffic alerts and exportable reports.

---

## 🎯 What TrafficIQ Does

TrafficIQ combines three computer vision capabilities into one unified management platform:

- **Vehicle Detection and Tracking** — YOLOv8 + ByteTrack detects and tracks all vehicles across camera feeds
- **License Plate Recognition** — EasyOCR reads plate numbers from detected vehicles
- **Traffic Flow Analysis** — Real-time vehicle counting, density measurement and anomaly detection

---

## 🏛️ Target Agencies

- EDSTMA — Edo State Traffic Management Authority
- VIO Edo — Vehicle Inspection Officers
- FRSC — Federal Road Safety Corps

---

## 🗺️ Benin City Camera Feeds

- Airport Road Feed
- Sapele Road Feed
- Ring Road Checkpoint
- Aduwawa Corridor

---

## ✨ V3 Features

### Role-Based Login
Three user roles with different dashboard views:
- **Traffic Officer** — Dashboard, Live Feed, Incidents, Offenders, Mobile Alerts
- **Agency Director** — Full access including Reports page
- **Toll Operator** — Dashboard, Plate Log, Watchlist only

### Incident Management
- Auto-detection of stalls, congestion, watchlist matches, speeding and wrong-way vehicles
- Full lifecycle: Open, Acknowledged, Resolved
- Officer assignment to specific EDSTMA field officers
- Real-time alert banner for watchlist matches

### Repeat Offender Profiling
- Tracks plates flagged multiple times across camera feeds
- Risk ranking: Low, Medium, High
- Clickable detail modal with full offender profile
- Add to watchlist directly from offender profile

### Predictive Traffic Alerts
- Rule-based predictions from historical incident data
- Identifies peak hours per camera feed
- Actionable officer deployment recommendations

### Reports (Director Only)
- PDF report generation using jsPDF
- CSV export of all incidents
- Date range filtering
- Includes: vehicle counts, incidents by type and camera, watchlist hits, top offenders

### Mobile Officer Alert View
- Touch-optimized full screen view for field officers
- Large action buttons for Acknowledge and Resolve
- Shows only active Open and Watchlist Match incidents

---

## 🛠️ Tech Stack

| Layer | Tool |
|---|---|
| Frontend | React, TypeScript, Tailwind CSS, Shadcn UI |
| Charts | Recharts |
| PDF Generation | jsPDF |
| Backend API | FastAPI, Python |
| Database | SQLite (dev), Supabase PostgreSQL (production) |
| CV Pipeline | YOLOv8, ByteTrack, EasyOCR |
| Compute | Google Colab (T4 GPU) |
| Deployment | Vercel (frontend), Render (backend) |

---

## 🚀 Getting Started
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 🔗 API Backend

This frontend connects to the TrafficIQ V2 backend:
```
https://trafficiq-v2-backend.onrender.com
```

Available endpoints:
- `GET /stats` — Dashboard summary statistics
- `GET /incidents` — All incidents with optional filters
- `PATCH /incidents/{id}` — Update incident status
- `GET /vehicles` — Vehicle detection logs
- `GET /plates` — Plate recognition logs
- `GET /watchlist` — Flagged plates
- `POST /watchlist` — Add plate to watchlist
- `DELETE /watchlist/{plate}` — Remove plate from watchlist
- `GET /offenders` — Repeat offender rankings

---

## 📊 V3 vs V2 vs V1

| Feature | V1 | V2 | V3 |
|---|---|---|---|
| Vehicle Detection | ✅ | ✅ | ✅ |
| Plate Recognition | ✅ | ✅ | ✅ |
| Multi-Camera Feeds | No | ✅ | ✅ |
| Incident Management | No | ✅ | ✅ |
| Watchlist Alerts | No | ✅ | ✅ |
| Role-Based Login | No | No | ✅ |
| Officer Assignment | No | No | ✅ |
| Offender Profiling | No | Basic | ✅ Deep Profile |
| Predictive Alerts | No | No | ✅ |
| PDF Reports | No | No | ✅ |
| Mobile Officer View | No | No | ✅ |
| Edo State Theme | No | Partial | ✅ Full |

---

## 🎨 Design Theme

TrafficIQ V3 uses the full **Edo State color theme**:
- Primary: Deep Nigerian Red (#CC0000)
- Accent: Amber/Yellow (#F5A623)
- Background: Near-black (#0D0D0D)
- Sidebar: Deep dark red tint (#1A0A0A)

---

## 👤 Demo Credentials

| Role | Username | Password |
|---|---|---|
| Traffic Officer | officer | officer123 |
| Agency Director | director | director123 |
| Toll Operator | operator | operator123 |

---

## 📍 Project Context

TrafficIQ was built as a hackathon and competition project targeting the Edo State traffic management space. It demonstrates how computer vision and AI can modernize traffic management in Nigerian cities, starting with Benin City as a pilot before scaling to other Edo State urban centres including Ekpoma, Uromi and Auchi.

---

## 🏗️ Project Versions

- **V1** — Core CV pipeline, single feed detection, basic plate reading
- **V2** — Multi-camera simulation, incident management, watchlist alerts, analytics
- **V3** — Role-based access, officer assignment, deep offender profiling, PDF reports, mobile view, Edo State theme

---

*Built for Edo State. Powered by AI. Ready for Nigeria.*
