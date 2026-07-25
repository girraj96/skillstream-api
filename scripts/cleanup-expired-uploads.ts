import { prisma } from "../src/db/prisma";
import { expireOldPendingUploads } from "../src/modules/uploads/upload-cleanup.service";

async function main() {
  const isDryRun = process.argv.includes("--dry-run");
  const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
  const rawLimit = limitArg ? Number(limitArg.split("=")[1]) : undefined;
  const limit = rawLimit ? Math.min(Math.max(rawLimit, 1), 500) : 100;
  const result = await expireOldPendingUploads({
    dryRun: isDryRun,
    limit: limit,
  });

  console.log(`Mode: ${isDryRun ? "dry-run" : "apply"}`);
  console.log(`Limit: ${limit}`);

  console.log(`Expired uploads: ${result.expiredCount}`);
  console.log(`Deleted from S3: ${result.deletedFromS3Count}`);
  console.log("Failed deletes:", result.failedDeletes);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
