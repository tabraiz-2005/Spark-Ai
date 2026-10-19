# Validation record

Verified October 18, 2026.

- `npm run test`: 35 tests passed across four files.
- `npm run build`: production webpack build and TypeScript checks passed; homepage prerendered and `/api/coach` emitted as a Node server route.
- Tests cover balanced trial counts, scoring, missing reaction time, duplicate/held/late input, mixed results, retrieval relevance/no-match, duration/citation validation, language schema preservation, agent tool selection, tool allowlisting, bounded cycles, malformed NLP output, quota propagation, consent and request-size checks, origin checks, Vercel fail-closed demo protection, interruption/restart, timer cleanup, timer pause/resume/reset/reflection, and a full simulated practice-plus-two-round journey.
- Model tests use mocks. No real API calls or model-quality evaluation were performed.
- The injection test checks prompt separation and system instructions; it is not a full adversarial model evaluation.
- WCAG contrast calculations: main text on surface 15.89:1; supporting text on surface 8.49:1; supporting text on elevated surface 7.57:1; mint on surface 11.77:1; lavender on surface 6.40:1. This is not a complete accessibility audit.
- Visual browser QA and real-browser end-to-end interaction were unavailable. DOM-based component tests do not establish visual appearance, real display timing, or device compatibility.
- Live Gemini intake, generation, Urdu/Roman Urdu quality and citation faithfulness remain unverified because no API key was supplied.
- No deployment or paid-resource creation was performed.

Before presentation: run on your laptop and phone, complete both rounds, confirm no layout overlap, verify keyboard/touch controls, configure Gemini and the private demo code, and review one live cited plan.
