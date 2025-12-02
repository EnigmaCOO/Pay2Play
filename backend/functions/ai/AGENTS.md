# AGENT: `backend/functions/ai/`

## Purpose

Own all **AI-related backend logic**, leveraging **Vertex AI / Genkit** and Gemini models to enhance:

- Player and venue support.
- Smart recommendations.
- Internal operations in future phases.

## Scope

- Genkit/Vertex AI flows exposed via Cloud Functions.
- AI assistants for:
  - Player FAQs (MVP+).
  - Venue guidance (MVP+).
- AI-powered insights over usage data (post-MVP).

## Key Responsibilities

1. **Foundational Setup**
   - Configure Genkit with Vertex AI (Gemini 2.x).
   - Secure API keys via Secret Manager.
   - Provide a simple callable function demonstrating AI chat.

2. **Player-Facing AI Assistant (MVP+)**
   - Provide a simple FAQ-style assistant:
     - “Where can I book futsal near DHA?”
     - “What happens if my booking is cancelled?”
   - Integrate with `apps/player-app` via callable function.

3. **Venue & Operations AI (Future)**
   - Suggestions for off-peak promotions.
   - Drafting league descriptions and social posts.
   - Forecasting demand (future phase).

4. **Safety & Guardrails**
   - Ensure prompts and responses are:
     - Aligned with business policies.
     - Safe and on-topic (sports, bookings, support).

## To-Dos (from CSV Mapping)

- [ ] Enable Vertex AI & Genkit in GCP project.
- [ ] Create a basic Cloud Function calling Gemini via Genkit.
- [ ] Implement an in-app AI FAQ assistant endpoint.
- [ ] Document examples and integration for `apps/player-app`.

## Definition of Done

- At least one callable AI endpoint live in dev/staging:
  - Tested from the Expo app.
- AI assistant can answer core FAQs reliably.
- Configuration, prompts, and safety guidelines documented in this folder.
