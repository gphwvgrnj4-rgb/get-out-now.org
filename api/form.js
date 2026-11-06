// Forwards get-out-now.org form posts (petition, gon-signup, gon-contact) to the existing
// Netlify forms on whimsical-monstera-1f180b.netlify.app (Netlify Forms + submission-created still run there).
const NETLIFY = "https://whimsical-monstera-1f180b.netlify.app/";
const FORMS = new Set(["petition","gon-signup","gon-contact"]);
export default async (req, res) => {
  if (req.method !== "POST") { res.statusCode = 405; return res.end("Method not allowed"); }
  let body = req.body;
  if (typeof body !== "object" || body === null) {
    const raw = typeof body === "string" ? body : await new Promise(r => { let d=""; req.on("data",c=>d+=c); req.on("end",()=>r(d)); });
    body = Object.fromEntries(new URLSearchParams(raw));
  }
  const ajax = req.query.ajax === "1";
  let next = String(req.query.next || "/thanks");
  if (!next.startsWith("/") || next.startsWith("//")) next = "/thanks";
  let ok = true;
  if (!body["bot-field"] && FORMS.has(body["form-name"])) {
    try {
      const r = await fetch(NETLIFY, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(body).toString(), redirect: "manual" });
      ok = r.status < 400;
    } catch (e) { ok = false; console.error("forward failed", e); }
  }
  if (ajax) { res.statusCode = ok ? 200 : 502; return res.end(ok ? "ok" : "error"); }
  res.writeHead(303, { Location: next }); res.end();
};
