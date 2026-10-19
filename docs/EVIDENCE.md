# Evidence collection

Eight short paraphrased passages, each with source URL, attribution, year, retrieval tags, limitations, practical application and verification date, are bundled in `data/evidence.json`.

The APA institutional overview, three arXiv abstracts, three University of Illinois research reports, and one PMC full-text primary study were opened and read. Claims are limited to the accessible material. The institutional reports are not represented as full-paper reviews. No paper validates FocusLab itself. PubMed pages that did not render were not used as verified standalone entries.

Retrieval is local BM25-style lexical ranking: stop-word removal, term frequency, inverse document frequency and length normalization; maximum three positive-scoring entries. Each entry is already a short passage, so no additional chunk splitting is necessary. There is no vector database. English search concepts come from NLP or the agent. Irrelevant queries return no evidence.

Source links:
- https://www.apa.org/topics/research/multitasking
- https://arxiv.org/abs/1805.05508
- https://arxiv.org/abs/2006.12636
- https://arxiv.org/abs/1810.04673
- https://news.illinois.edu/brief-diversions-vastly-improve-focus-researchers-find/
- https://pmc.ncbi.nlm.nih.gov/articles/PMC7044622/
- https://news.illinois.edu/using-an-electronic-device-counteracts-benefits-of-taking-a-break-in-nature-researchers-find/
- https://news.illinois.edu/distracted-much-new-research-may-help-explain-why/

Implementation documentation checked:
- https://nextjs.org/docs/app/getting-started/installation
- https://ai.google.dev/gemini-api/docs/function-calling
- https://ai.google.dev/gemini-api/docs/pricing
- https://vercel.com/docs/functions/configuring-functions/duration

The route uses a 60-second platform ceiling and a 45-second application deadline. Official Vercel documentation described a 300-second Hobby ceiling with Fluid Compute; verify your deployment's actual configuration. No background worker or runtime filesystem persistence is required.
