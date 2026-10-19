# MindSpark AI — design update

Extract into a new folder. Copy your existing `.env.local` into this folder beside package.json. Never overwrite a working key with the blank example file. Stop the old server with Control+C.

```bash
npm ci
npm run dev
```

Open http://localhost:3000. The AI coach requires your Gemini key and explicit consent. /api/coach reports configuration, not whether a live Gemini call succeeds. Do not share your key. Existing FOCUSLAB_DEMO_CODE and history storage names remain compatible.

## What's new
- MindSpark AI branding and midnight/lilac/mint visual design.
- Interactive six-choice untimed landing preview, separate from experiment scores.
- Mobile-friendly cards, prominent controls, visible focus, skip link, and reduced-motion support.
- Context → challenge → insights → focus session journey indicators.
- Progress indicator during each round; no animation during scored trials.
- Clearer configuration and consent guidance.

This update preserves the uploaded ZIP's core focus experiment, NLP, evidence retrieval, bounded AI coach, focus timer, and optional local history. The uploaded ZIP did not contain Talk It Through or the optional rule-switching game; those are not included in this package.

## Demo rehearsal
Use a clean browser profile, complete practice and both rounds, check the result table, generate a real AI plan with consent, and start the timer. If AI is unavailable, demonstrate the visibly labelled basic guidance. No clinical, healing, or cognitive-improvement claims.

## Verification
Automated logic and interaction tests and a production build are run for this release. Live Gemini calls and visual browser QA are not verified in this environment. No deployment was performed. Follow README for Vercel setup; retain the private demo gate for hosted AI.
