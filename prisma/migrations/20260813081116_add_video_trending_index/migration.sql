-- CreateIndex
CREATE INDEX `Video_visibility_status_deletedAt_viewsCount_id_idx` ON `Video`(`visibility`, `status`, `deletedAt`, `viewsCount`, `id`);
