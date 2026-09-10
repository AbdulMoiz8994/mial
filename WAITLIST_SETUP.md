# Waitlist → Spreadsheet setup

The `/waitlist` form posts each submission to a Google Apps Script Web App, which
appends a row to the spreadsheet:

https://docs.google.com/spreadsheets/d/1-9ajPZjZQsmRo5XawRyBwxUCCh3sRhCSVEfqmkTwpCA/edit

| Column | Source |
| --- | --- |
| Phone Number | form field |
| Email Address | form field |
| Business | form field |
| Date/Time | stamped by the Apps Script server, not the browser |

The header row is created automatically on the first submission if it isn't
already there.

## Why Apps Script and not an API route

`vercel.json` deploys this project as a **static SPA** (`vite build`, output
`dist/public`, every path rewritten to `index.html`). There are no serverless
functions in the deployment, so the Express app in `server/` does not run in
production and the browser has no backend of ours to post to. The Apps Script
Web App is the backend for this one form, and it needs no API keys or service
account credentials stored anywhere.

## One-time setup

**1. Create the Web App**

1. Open the spreadsheet → **Extensions → Apps Script**.
2. Delete whatever is in `Code.gs` and paste the entire contents of
   [`scripts/waitlist-apps-script.gs`](scripts/waitlist-apps-script.gs).
3. Save (Ctrl+S).

**2. Deploy it**

1. **Deploy → New deployment** → gear icon → **Web app**.
2. Set:
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`  ← must be "Anyone", not "Anyone with Google account"
3. **Deploy**, then **Authorize access** and approve the permission prompt.
   (On the "Google hasn't verified this app" screen: *Advanced → Go to … (unsafe)*.
   That warning is normal for your own scripts.)
4. Copy the **Web app URL**. It looks like:
   `https://script.google.com/macros/s/AKfycb.../exec`

**3. Point the site at it**

Locally — create a `.env` in the repo root (already gitignored):

```
VITE_WAITLIST_URL=https://script.google.com/macros/s/AKfycb.../exec
```

On Vercel — **Project → Settings → Environment Variables**:

- Name: `VITE_WAITLIST_URL`
- Value: the same `/exec` URL
- Environments: Production, Preview, Development

Then **redeploy**. `VITE_*` variables are baked in at build time, so an existing
deployment will not pick up the new value without a rebuild.

## Verifying

- Open the `/exec` URL directly in a browser. It should return
  `{"ok":true,"service":"mia-waitlist"}`.
- Submit the form on `/waitlist`. You should see *"You're on the list!"* and a
  new row should appear in the sheet within a second or two.

## Notes

- **Re-deploying after editing the script:** use **Deploy → Manage deployments →
  edit (pencil) → Version: New version → Deploy**. Creating a *new* deployment
  instead gives you a different URL and you'd have to update `VITE_WAITLIST_URL`.
- **Phone numbers** are written with a leading apostrophe so Sheets keeps
  `+44…` and `07…` exactly as typed rather than reformatting them as numbers.
- **Timezone** for the Date/Time column is set by `TIMEZONE` at the top of the
  script (currently `Europe/London`). Change it there if needed.
- **Excel:** the sheet exports to `.xlsx` at any time via **File → Download →
  Microsoft Excel**.
