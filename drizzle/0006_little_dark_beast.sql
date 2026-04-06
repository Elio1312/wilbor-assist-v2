CREATE TABLE `magicLinkTokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`usedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `magicLinkTokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `magicLinkTokens_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
ALTER TABLE `wilborEbooks` ADD `ebookLang` enum('pt','en','es','fr','de') DEFAULT 'pt' NOT NULL;--> statement-breakpoint
ALTER TABLE `wilborEbooks` ADD `titleFr` text;--> statement-breakpoint
ALTER TABLE `wilborEbooks` ADD `titleDe` text;--> statement-breakpoint
ALTER TABLE `wilborEbooks` ADD `descriptionFr` text;--> statement-breakpoint
ALTER TABLE `wilborEbooks` ADD `descriptionDe` text;--> statement-breakpoint
ALTER TABLE `wilborEbooks` ADD `priceGbp` int DEFAULT 600 NOT NULL;--> statement-breakpoint
ALTER TABLE `wilborMessages` ADD `feedbackRating` int;