// Fires automatically on every verified (non-spam) Netlify Forms submission (special filename).
// 1) Petition signatures: recorded in Netlify Blobs (one key per submission id) so that
//    petition-count can report a real count. They are NOT forwarded to the ingest below.
// 2) Help/contact forms: forwarded to the GON content-studio ingest so they land in the
//    "Sign-ups" inbox. The shared secret + URL come from env vars (repo is public — never inline them).
import { getStore, connectLambda } from "@netlify/blobs";

export const handler = async (event) => {
  let payload = {};
  try { payload = JSON.parse(event.body || "{}").payload || {}; } catch (e) {}
  const data = payload.data || {};

  if (payload.form_name === "petition") {
    try {
      connectLambda(event);
      const store = getStore("petition-signatures");
      // Store only what's needed to count/deduplicate; names stay in Netlify Forms.
      await store.setJSON(`sig/${payload.id}`, { ts: payload.created_at, lang: data.lang || null, country: data.country || null });
      console.log("petition signature recorded");
    } catch (e) {
      console.log("petition record failed:", String(e));
    }
    return { statusCode: 200, body: "ok" };
  }

  try {
    const body = {
      id: payload.id,
      ts: payload.created_at,
      site: "get-out-now.org",
      form: payload.form_name,
      fields: {
        first_name: data.first_name,
        name: data.name,
        phone_number: data.phone_number,
        email: data.email,
        contact_channel: data.contact_channel,
        message: data.message,
        lang: data.lang,
      },
    };
    const url = process.env.GON_INGEST_URL || "https://gon.seokru.com/gon/signups/ingest";
    const token = process.env.SIGNUP_INGEST_TOKEN || "";
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-ingest-token": token },
      body: JSON.stringify(body),
    });
    console.log("ingest forward:", r.status);
  } catch (e) {
    console.log("ingest forward failed:", String(e));
  }
  // Never fail the submission because the forward hiccuped.
  return { statusCode: 200, body: "ok" };
};
