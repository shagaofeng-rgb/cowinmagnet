import { recoverStaleNewsPublishWork } from "../lib/newsAutomationStore.js";

const siteId = process.env.NEWS_SITE_ID || "cowinmagnet-production";
const result = await recoverStaleNewsPublishWork({ siteId, maxAgeMinutes: 10 });
console.log(JSON.stringify({ siteId, ...result }, null, 2));
