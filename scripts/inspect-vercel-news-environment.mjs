const token = process.env.VERCEL_TOKEN || process.env.VERCEL_API_TOKEN;
const projectId = "prj_iXepbQHaIFG13YxbGRQgEJ2M6VVR";
const teamId = "team_jV6c9fKQrHqay1jPr7GIKvgn";

if (!token) {
  console.log(JSON.stringify({ configured: false, reason: "vercel-token-not-configured" }));
  process.exit(0);
}

const response = await fetch(`https://api.vercel.com/v10/projects/${projectId}/env?teamId=${teamId}`, {
  headers: { authorization: `Bearer ${token}` }
});
if (!response.ok) throw new Error(`Vercel environment query failed: ${response.status}`);
const payload = await response.json();
const keys = new Set((payload.envs || []).map((entry) => entry.key));
const watched = ["NEWS_AUTO_PUBLISH", "OPENAI_API_KEY", "OBJECT_STORAGE_BUCKET", "OBJECT_STORAGE_PUBLIC_BASE_URL", "CRON_SECRET", "DATABASE_URL"];
console.log(JSON.stringify({ configured: true, present: Object.fromEntries(watched.map((key) => [key, keys.has(key)])) }, null, 2));
