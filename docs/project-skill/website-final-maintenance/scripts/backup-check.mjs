import fs from "node:fs";

const backupRoot = "/Users/apple/Documents/cowinmagnet.com/final-audit-backups";
console.log(JSON.stringify({ backupRoot, exists: fs.existsSync(backupRoot) }, null, 2));
