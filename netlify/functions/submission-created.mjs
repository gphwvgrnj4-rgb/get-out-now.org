// Fires automatically on every Netlify Forms submission (special filename).
// Forwards the submission to the GON content-studio ingest so it lands in the
// "Sign-ups" inbox for an AI-drafted reply. Zero deps (Node 18 global fetch).
// The shared secret + URL come from env vars (repo is public — never inline them).
export const handler = async (event) => {
  try {
    const { payload } = JSON.parse(event.body || "{}");
    const data = (payload && payload.data) || {};
    const body = {
      id: payload && payload.id,
      ts: payload && payload.created_at,
      site: "get-out-now.org",
      form: payload && payload.form_name,
      fields: {
        first_name: data.first_name,
        name: data.name,
        phone_number: data.phone_number,
        email: data.email,
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
