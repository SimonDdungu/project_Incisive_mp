CREATE TABLE `videos` (
	`id` text PRIMARY KEY NOT NULL,
	`uri` text NOT NULL,
	`filename` text NOT NULL,
	`is_favorite` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `videos_uri_unique` ON `videos` (`uri`);