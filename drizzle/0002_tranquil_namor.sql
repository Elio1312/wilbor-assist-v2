CREATE TABLE `wilborChatAnalytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`conversationId` int,
	`routeType` enum('cache','rag','llm_full','safety_filter') NOT NULL,
	`analyticsCategory` varchar(50),
	`tokensEstimated` int NOT NULL DEFAULT 0,
	`responseTimeMs` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `wilborChatAnalytics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wilborConversionEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`eventType` enum('hit_limit','paywall_shown','upgrade_clicked','plans_clicked','checkout_started','payment_success','payment_failed') NOT NULL,
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `wilborConversionEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `wilborUserCredits` ADD `ragMessagesUsed` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `wilborUserCredits` ADD `cacheHits` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `wilborUserCredits` ADD `totalSaved` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `wilborUserCredits` ADD `periodStart` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `wilborUserCredits` ADD `periodEnd` timestamp NOT NULL;