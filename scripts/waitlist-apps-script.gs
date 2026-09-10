/**
 * MIA — Waitlist → Google Sheet
 *
 * Receives POSTs from the /waitlist form and appends one row per submission.
 *
 * Columns (row 1, created automatically if missing):
 *   A: Phone Number
 *   B: Email Address
 *   C: Business
 *   D: Date/Time   <- stamped here, on the server, not by the browser
 *
 * Setup: see WAITLIST_SETUP.md in the repo root.
 */

var SHEET_ID = '1-9ajPZjZQsmRo5XawRyBwxUCCh3sRhCSVEfqmkTwpCA';
var SHEET_NAME = '';           // '' = first sheet in the spreadsheet (gid=0)
var TIMEZONE = 'Europe/London'; // timestamp is written in this timezone

var HEADERS = ['Phone Number', 'Email Address', 'Business', 'Date/Time'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // Serialise concurrent submissions so two people never claim the same row.
    lock.waitLock(30000);

    var data = parseBody_(e);

    var phone = String(data.phone || '').trim();
    var email = String(data.email || '').trim();
    var business = String(data.business || '').trim();

    if (!phone || !email || !business) {
      return json_({ ok: false, error: 'Phone, email and business are all required.' });
    }

    var sheet = getSheet_();
    ensureHeaders_(sheet);

    var timestamp = Utilities.formatDate(new Date(), TIMEZONE, 'yyyy-MM-dd HH:mm:ss');

    // Leading apostrophe keeps phone numbers such as +44... or 0790... intact
    // instead of letting Sheets reformat them as numbers or formulas.
    sheet.appendRow(["'" + phone, email, business, timestamp]);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
  } finally {
    try { lock.releaseLock(); } catch (ignored) {}
  }
}

/** Health check — open the /exec URL in a browser to confirm the deploy works. */
function doGet() {
  return json_({ ok: true, service: 'mia-waitlist' });
}

function getSheet_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  if (SHEET_NAME) {
    var named = ss.getSheetByName(SHEET_NAME);
    if (!named) throw new Error('Sheet "' + SHEET_NAME + '" not found.');
    return named;
  }
  return ss.getSheets()[0];
}

/** Writes the header row if the sheet is empty or its headers don't match. */
function ensureHeaders_(sheet) {
  var needsHeaders = sheet.getLastRow() === 0;

  if (!needsHeaders) {
    var current = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
    for (var i = 0; i < HEADERS.length; i++) {
      if (String(current[i]).trim() !== HEADERS[i]) {
        needsHeaders = true;
        break;
      }
    }
  }

  if (!needsHeaders) return;

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  } else {
    sheet.insertRowBefore(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }

  sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
}

/** Accepts JSON, form-encoded, or query-string payloads. */
function parseBody_(e) {
  if (!e) return {};

  if (e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (ignored) {
      // fall through to the form-encoded parameters below
    }
  }

  return e.parameter || {};
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
