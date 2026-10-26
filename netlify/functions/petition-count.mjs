// Returns the real number of petition signatures recorded by submission-created
// (one Netlify Blobs key per verified submission). No API token needed.
// Returns {count:null} on any error so the page simply hides the counter.
import { getStore } from "@netlify/blobs";

export default async () => {
  const headers = { "Content-Type": "application/json", "Cache-Control": "public, max-age=60" };
  try {
    const store = getStore("petition-signatures");
    let count = 0;
    for await (const page of store.list({ prefix: "sig/", paginate: true })) count += page.blobs.length;
    return new Response(JSON.stringify({ count }), { headers });
  } catch (e) {
    console.log("petition-count failed:", String(e));
    return new Response(JSON.stringify({ count: null }), { headers });
  }
};

