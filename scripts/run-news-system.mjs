import { runDailyNewsSystem } from "../lib/news-system/daily-runner.mjs";

const run = await runDailyNewsSystem();

console.log(
  JSON.stringify(
    {
      date: run.date,
      sourceCount: run.sourceCount,
      selectedCount: run.selectedCount,
      jsonPath: run.paths?.jsonPath,
      markdownPath: run.paths?.markdownPath
    },
    null,
    2
  )
);
