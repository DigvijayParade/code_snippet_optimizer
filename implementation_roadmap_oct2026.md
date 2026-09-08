# Implementation Roadmap – Integrated Agri Hub (Target Completion: October 2026)

---

## 1️⃣ Project Status Overview (as of 07‑Sep‑2026)
| Area | Current State | Done ✅ | Pending ⏳ |
|------|---------------|--------|-----------|
| **Core Flutter UI** | Navigation, Home, Education, Quiz, Tasks, Admin Dashboard – **Stable** | ✅ | — |
| **AI Integration** | Gemini Vision for disease detection, Gemini Text for dynamic lessons & quizzes – functional, needs final prompt‑tuning and fallback handling. | ✅ | Minor improvements |
| **Green‑Coin Economy** | Task submission flow, admin verification, coin credit – working in dev. | ✅ | UI polish & edge‑case handling |
| **Multilingual & TTS** | Dynamic translation widget, TTS service set to `en-US` for English – working. | ✅ | Add Marathi support, test edge cases |
| **Firebase Backend** | Firestore schema, Auth, Storage – deployed (test). | ✅ | Security rules review |
| **Documentation & Paper** | README, basic spec, implementation report – drafted. | ✅ | Full paper write‑up |

---

## 2️⃣ Remaining Development Milestones (Oct 2026 Deadline)
| Milestone | Description | Owner(s) | Target Finish |
|----------|-------------|----------|---------------|
| **M1 – AI Prompt Stabilisation** | Refine Gemini prompts for disease detection, lesson generation, quiz creation. Add regex validation of JSON output. | Dev‑Team (AI) | **Week 1 (09 Oct)** |
| **M2 – UI/UX Polish** | Final visual redesign of Tasks & Quiz screens (glass‑morphism, micro‑animations). Ensure all buttons have accessible contrast. | UI/UX Lead | **Week 1 (12 Oct)** |
| **M3 – Multilingual Expansion** | Add Marathi language dictionary, integrate fallback to Google Translate API, test TTS for all languages. | Localization Engineer | **Week 2 (19 Oct)** |
| **M4 – Admin Verification Flow** | Implement batch verification UI, auto‑reject blurry uploads, add AI‑fallback verification for low‑load periods. | Backend Lead | **Week 2 (22 Oct)** |
| **M5 – Security & Rules Audit** | Review Firebase security rules, add unit tests for auth/role checks, perform penetration test on API keys. | Security Engineer | **Week 3 (26 Oct)** |
| **M6 – End‑to‑End Testing** | Write integration tests (Flutter driver) covering: disease detection → task reward, lesson → quiz → coin credit, multilingual UI. Run CI pipeline on GitHub Actions. | QA Engineer | **Week 3 (29 Oct)** |
| **M7 – Documentation Finalisation** | Complete the research paper sections (Methodology, Results, Discussion). Add UML diagrams (class, sequence) and architecture diagram. Export to PDF. | Lead Author | **Week 4 (31 Oct)** |
| **M8 – Presentation Prep** | Create slide deck (10‑12 slides), demo video (2 min), live‑demo checklist. Rehearse Q&A. | All | **Week 4 (31 Oct)** |

---

## 3️⃣ Detailed Weekly Sprint Plan

### **Week 1 (02‑09 Oct – 08‑Oct 2026)**
- **Day 1‑2:** Finalise Gemini prompts & implement JSON validation helper (`GeminiResponseParser`).
- **Day 3‑4:** UI polish – apply glass‑morphism cards, subtle hover/press animations, micro‑interactions on task upload.
- **Day 5:** Internal demo of AI‑driven lesson & quiz flow; collect feedback.

### **Week 2 (09‑Oct – 15‑Oct 2026)**
- **Day 1‑3:** Add Marathi dictionary entries, integrate Google Translate fallback, test TTS voices (`mr-IN`).
- **Day 4‑5:** Build admin batch verification screen; implement image‑blur detection (OpenCV via `image` package).

### **Week 3 (16‑Oct – 22‑Oct 2026)**
- **Day 1‑2:** Security rules audit; write unit tests for role‑based access.
- **Day 3‑5:** End‑to‑end integration tests; set up CI pipeline (GitHub Actions + Firebase Test Lab).

### **Week 4 (23‑Oct – 31‑Oct 2026)**
- **Day 1‑3:** Write final paper sections; embed architecture diagram (drawn in draw.io, exported as SVG).
- **Day 4‑5:** Prepare slide deck, record a 2‑minute demo video (screen + device capture), final rehearsals.

---

## 4️⃣ Deliverables for Presentation
| Deliverable | Format | Where to Find |
|------------|--------|----------------|
| **Demo APK** | `integrated_agri_hub.apk` (signed) | `build/app/outputs/flutter-apk/` |
| **Architecture Diagram** | SVG/PNG | `docs/architecture.svg` |
| **UML Class & Sequence Diagrams** | PDF | `docs/uml.pdf` |
| **Research Paper** | PDF (IEEE template) | `paper/Integrated_Agri_Hub.pdf` |
| **Slide Deck** | PPTX | `presentation/AgriHub_Oct2026.pptx` |
| **Demo Video** | MP4 (2 min) | `presentation/demo.mp4` |

---

## 5️⃣ Risk Register & Mitigation
| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Gemini API latency / quota | Missed deadline for AI‑generated content | Medium | Cache generated lessons locally; fallback to static content after 2‑day retry.
| Multilingual TTS voice mismatch | Poor user experience for Hindi/Marathi users | Low | Force language codes (`en‑US`, `hi‑IN`, `mr‑IN`) and test on multiple devices.
| Firebase Security Mis‑config | Data breach risk | Low | Conduct external security audit; enable Firebase App Check.
| Presentation demo crashes | Live demo failure | High | Pre‑load all assets, run a rehearsal on the same device used for the demo.

---

## 6️⃣ Quick Reference – Commands & Scripts
```bash
# Build signed APK (release)
flutter build apk --release

# Run unit & integration tests
flutter test && flutter drive --target=test_driver/app.dart

# Deploy Firestore security rules
firebase deploy --only firestore:rules

# Generate UML (using plantuml-cli)
plantuml -tsvg docs/uml/*.puml -o docs
```

---

### 🎯 Bottom Line
Following this roadmap will have **all functional, UI, security, and documentation pieces** ready before the October presentation, ensuring a smooth live demo and a solid research paper.

If you need any specific sections expanded (e.g., deeper AI prompt examples or database schema), just let me know!
