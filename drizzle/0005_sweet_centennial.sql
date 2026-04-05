CREATE TABLE `wilborEbookPurchases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`ebookId` varchar(100) NOT NULL,
	`amount` int NOT NULL,
	`currency` varchar(10) NOT NULL,
	`stripeSessionId` varchar(255) NOT NULL,
	`purchaseStatus` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wilborEbookPurchases_id` PRIMARY KEY(`id`),
	CONSTRAINT `wilborEbookPurchases_stripeSessionId_unique` UNIQUE(`stripeSessionId`)
);
--> statement-breakpoint
CREATE TABLE `wilborEbooks` (
	`id` varchar(100) NOT NULL,
	`titlePt` text NOT NULL,
	`titleEn` text,
	`titleEs` text,
	`descriptionPt` text NOT NULL,
	`descriptionEn` text,
	`descriptionEs` text,
	`category` varchar(50) NOT NULL,
	`priceBrl` int NOT NULL,
	`priceUsd` int NOT NULL,
	`priceEur` int NOT NULL,
	`coverImage` text NOT NULL,
	`pdfUrl` text NOT NULL,
	`rating` decimal(3,2) DEFAULT '5.00',
	`reviewCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wilborEbooks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wilborMilestoneContent` (
	`id` int AUTO_INCREMENT NOT NULL,
	`month` int NOT NULL,
	`milestoneCategory` enum('motor','cognitivo','linguagem','social') NOT NULL,
	`titlePt` text NOT NULL,
	`descriptionPt` text NOT NULL,
	`titleEn` text,
	`descriptionEn` text,
	`titleEs` text,
	`descriptionEs` text,
	`order` int DEFAULT 0,
	`contentIsActive` enum('true','false') NOT NULL DEFAULT 'true',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wilborMilestoneContent_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `wilborDevMilestones` ADD `contentId` int NOT NULL;--> statement-breakpoint
ALTER TABLE `wilborResponseFeedback` ADD `aiVerdict` enum('VERÍDICA','INCONSISTENTE','ELOGIO','pending') DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `wilborResponseFeedback` ADD `aiJustification` text;--> statement-breakpoint
ALTER TABLE `wilborResponseFeedback` ADD `feedbackStatus` enum('new','reviewed','archived') DEFAULT 'new' NOT NULL;--> statement-breakpoint
ALTER TABLE `wilborDevMilestones` DROP COLUMN `weekNumber`;--> statement-breakpoint
ALTER TABLE `wilborDevMilestones` DROP COLUMN `milestoneKey`;