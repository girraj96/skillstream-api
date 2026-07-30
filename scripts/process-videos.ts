import { prisma } from "../src/db/prisma";
import { processVideos } from "../src/modules/videos/video-processing.service";

function parseLimitArg() {
  const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
  const rawLimit = limitArg ? Number(limitArg.split("=")[1]) : undefined;

  if (rawLimit !== undefined && Number.isNaN(rawLimit)) {
    return undefined;
  }

  return rawLimit;
}

async function main() {
  const isDryRun = process.argv.includes("--dry-run");
  const limit = parseLimitArg();

  const result = await processVideos({
    dryRun: isDryRun,
    limit,
  });

  console.log(`Mode: ${result.mode}`);
  console.log(`Limit: ${result.limit}`);
  console.log(`Processing videos found: ${result.processingVideosFound}`);
  console.log(`Processed videos: ${result.processedVideos}`);
  console.log("Failed videos:", result.failedVideos);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
