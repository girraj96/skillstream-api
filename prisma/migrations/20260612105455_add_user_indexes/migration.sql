-- CreateIndex
CREATE INDEX `User_deletedAt_createdAt_idx` ON `User`(`deletedAt`, `createdAt`);

-- CreateIndex
CREATE INDEX `User_role_deletedAt_idx` ON `User`(`role`, `deletedAt`);
