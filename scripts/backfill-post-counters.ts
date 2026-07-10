// scripts/backfill-post-counters.ts

import { prisma } from "../src/db/prisma";

async function backfillPostCounters() {
  const posts = await prisma.post.findMany({
    where: {
      deletedAt: null,
    },
    select: {
      id: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  console.log(`Backfilling counters for ${posts.length} posts...`);

  for (const post of posts) {
    const [likesCount, commentsCount] = await Promise.all([
      prisma.postLike.count({
        where: {
          postId: post.id,
        },
      }),
      prisma.comment.count({
        where: {
          postId: post.id,
          deletedAt: null,
        },
      }),
    ]);

    await prisma.post.update({
      where: {
        id: post.id,
      },
      data: {
        likesCount,
        commentsCount,
      },
    });

    console.log(
      `Post ${post.id}: likes=${likesCount} comments=${commentsCount}`,
    );
  }

  console.log("Done.");
}

backfillPostCounters()
  .catch((error) => {
    console.error("Backfill failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
