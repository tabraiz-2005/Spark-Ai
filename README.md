# MindSpark AI

**Understand your focus. Take back your attention.**

A Next.js hackathon MVP combining a browser attention experiment, deterministic scoring, local evidence retrieval, a bounded Gemini tool-using coach, and an editable focus session.

## Quick start

Use Node.js 22 LTS (minimum Next.js requirement: 20.9; Node 22+ recommended for the test tooling).

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. No key is needed for the experiment, basic plan, focus timer, reflections, or local history.

For AI, obtain a Gemini API key from https://aistudio.google.com/ and set `GEMINI_API_KEY` in `.env.local`. `GEMINI_MODEL` defaults to `gemini-2.5-flash`, whose free tier was checked against Google's pricing page on October 18, 2026. Verify current availability and quota for your account before the event. Restart the dev server after changing environment values. Never paste a secret into frontend files or commit `.env.local`.

```bash
npm run test
npm run typecheck
npm run build
npm start
```

## Deploy yourself on Vercel

1. Create your own GitHub repository and push the project source. Include `package-lock.json`; exclude node_modules, .next, and .env.local.
2. Import the repository into Vercel and choose the Next.js preset. Use Node 22 or newer supported runtime. No custom output directory is needed.
3. Add server-only environment variables: `GEMINI_API_KEY`, `GEMINI_MODEL=gemini-2.5-flash`, and a long random `FOCUSLAB_DEMO_CODE`.
4. Deploy. The app does not create paid resources or enable billing.
5. Give the private demo code only to judges/testers. Enter it in the app's demo-code field before requesting AI. It stays in React memory and is not saved to history.
6. Verify the full experiment, AI intake, cited plan, and missing-key/quota fallback. Configure preview and production environment values separately as needed and redeploy after changes.

**Protection:** On Vercel, the AI route fails closed if no demo code is set. A shared secret is a restricted-demo gate, not a durable rate limiter or public-service abuse solution. Keep access restricted; rotate the code if exposed. Before broad public launch, add a shared persistent rate limiter or Vercel firewall rules appropriate to your account. No unreliable in-memory “global limiter” is claimed. Vercel and Gemini free tiers have limits and eligibility conditions; do not enable paid billing to bypass quota without deciding explicitly.

## Meaningful AI

- NLP extracts task, time, distractions, constraints, language, missing fields, and English retrieval concepts using structured output and Zod validation. Missing time remains null.
- RAG searches eight short bundled passages with BM25-style lexical retrieval. URLs, verification dates, evidence and limitations are in `data/evidence.json`.
- One Gemini agent selects allowlisted `get_session_metrics`, `retrieve_evidence`, and `validate_plan` tools. At most three model cycles, with no arbitrary browsing or execution. Tool responses are sent back to the model and trace outcomes appear in the UI.
- Output validation checks schema, citation membership, duration totals, explicit numeric performance claims, and a limited clinical-claim denylist. These checks do not prove semantic faithfulness or catch every unsafe paraphrase. Human review is still needed. Metrics are rendered deterministically, outside generated narrative.
- A failed, timed-out, malformed, or quota-limited response produces a labeled basic plan. No canned response is presented as AI. The fallback is English.

The agent needs to request metrics and evidence together, validate in the next cycle, then return its plan. Models that fail this bounded protocol fall back safely. The final output is revalidated even after a validation tool call.

## Experiment

Six practice trials are excluded from scores. Each scored condition has 24 trials: 12 blue-circle targets and four of each non-target shape. Condition order and stimulus order are randomized. Each stimulus has a 900 ms response window, then a 300–500 ms blank interval. Six simulated notifications appear at fixed trial indices during the distraction round. Practice has longer feedback intervals.

The timing clock uses `performance.now()` after animation-frame scheduling. This is approximate browser timing, not laboratory hardware. The app ignores duplicate, held-key, out-of-window responses. Tab hiding/window blur interrupts the current round and discards it; the completed first round is retained.

- Hit: respond to target.
- Miss: no response to target.
- False alarm: respond to non-target.
- Correct rejection: no response to non-target.
- Accuracy: (hits + correct rejections) / 24.
- Median reaction time: correct-target responses only; null if none.

A single short session cannot identify a stable trait or establish causality. Order, practice, fatigue, hardware, input method, and chance matter. This is not a validated clinical instrument. It is not an ADHD test, diagnostic service, or measure of brain activity. Suggested timer schedules are not scientifically optimized.

## Privacy

Experiment data stays in-browser unless the user explicitly requests AI with consent. Intake sends entered text and language; coaching sends edited context and aggregate scores, not trial-level records. Google free-tier processing may use inputs to improve products; see https://ai.google.dev/gemini-api/terms. Do not enter sensitive information. There is no analytics, account, or app-owned database. Hosting/provider infrastructure may have its own logs and policies.

Optional local history contains short session summaries/reflections, capped at 50 records. It is browser-specific, removable, and not encrypted. Exports are user-triggered. Storage failure keeps the session usable in memory.

## Design and accessibility

Responsive dark interface with mint/lavender accents. System fonts, CSS geometry, no external image/font requests. Keyboard focus, labeled forms, text equivalents for result charts, and reduced-motion support. A visual shape task inherently requires vision and motor input; a fully nonvisual alternative is not included. Do not interpret accessibility-related differences as cognitive differences.

## Structure

- `components/MindSpark AI.tsx`: main product journey, results, coach, history, evidence.
- `components/Experiment.tsx`: challenge state and browser timing.
- `components/FocusTimer.tsx`: timestamp-based work timer and reflection.
- `lib/core.ts`: pure scoring, schemas and plan checks.
- `lib/agent.ts`: Gemini structured NLP and tool loop.
- `lib/retrieval.ts`: bundled BM25 retrieval.
- `lib/storage.ts`: resilient local history and exports.
- `app/api/coach/route.ts`: consent, input checks, secret gate, deadlines and model access.
- `data/evidence.json`: curated passages.
- `tests/`: pure, agent-mocked, endpoint and component tests.

## Verification and limitations

See `docs/VALIDATION.md` for the actual checks completed. No real Gemini key was supplied during creation, so live model output, citations, and English/Urdu/Roman Urdu quality need live smoke testing. Automated language tests verify schemas with mocked outputs, not translation quality. The interface itself is English; AI text uses automatic text direction.

No browser-control capability was available for visual/end-to-end QA. Component tests simulate DOM interactions but do not replace a real browser test. No Vercel deployment was performed, as requested.

## Demo

See `docs/DEMO.md`. Run the scored experiment in advance when presenting a strict 90-second pitch; the complete interactive journey takes longer once instructions and AI latency are included.


See UPGRADE.md for the design update and safe migration steps.
