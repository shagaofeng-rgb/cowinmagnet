import { getNewsSiteConfig } from "../lib/newsAutomationConfig.js";
import { listNewsSourcesForValidation, syncNewsSources } from "../lib/newsAutomationStore.js";

const site = getNewsSiteConfig(process.env.NEWS_SITE_ID || "cowinmagnet-production");
await syncNewsSources(site);
const pending = await listNewsSourcesForValidation({ siteId: site.site_id, limit: 1_000 });
console.log(JSON.stringify({ siteId: site.site_id, imported: true, pendingValidation: pending.length }, null, 2));
