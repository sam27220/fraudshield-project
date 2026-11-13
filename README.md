# FraudShield AI — EJS starter

A small Express + EJS starter for a hackathon prototype of transaction fraud detection and AML monitoring.

## Run locally
1. Install Node.js.
2. In this folder run `npm install`.
3. Copy `.env.example` to `.env` (MongoDB is optional for the current in-memory demo).
4. Run `npm run dev` or `npm start`.
5. Open http://localhost:3000

## Current demo
- Server-rendered dashboard, transactions and alerts pages.
- Synthetic transaction examples.
- Rule-based risk analysis form at `/analyze` (add the GET route shown below).
- Reusable risk and AML helper modules under `engine/`.

To expose the analysis form, add this route in `server.js`:
```js
app.get("/analyze", (req, res) => res.render("analyze"));
```

## Important
The scoring rules and sample data are illustrative only. They are not validated banking rules, do not prove fraud or money laundering, and must not be used for real financial decisions. Use synthetic data for the hackathon demo.
