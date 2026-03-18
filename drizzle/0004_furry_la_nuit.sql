CREATE TABLE `wilborExtraCreditTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`amountReais` decimal(10,2) NOT NULL,
	`creditsReceived` int NOT NULL,
	`stripeTransactionId` varchar(255) NOT NULL,
	`transactionStatus` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
	`usedCredits` int NOT NULL DEFAULT 0,
	`periodStart` timestamp NOT NULL,
	`periodEnd` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wilborExtraCreditTransactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `wilborExtraCreditTransactions_stripeTransactionId_unique` UNIQUE(`stripeTransactionId`)
);
--> statement-breakpoint
CREATE TABLE `wilborSosUsageLog` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`conversationId` int,
	`sosUsageType` enum('emergency','regular') NOT NULL DEFAULT 'regular',
	`costReais` decimal(10,2) NOT NULL,
	`injectedCredits` int NOT NULL DEFAULT 0,
	`stripeTransactionId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `wilborSosUsageLog_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `wilborUserCredits` ADD `extraCreditsUsedReais` decimal(10,2) DEFAULT '0.00' NOT NULL;--> statement-breakpoint
ALTER TABLE `wilborUserCredits` ADD `extraCreditsLimitReais` decimal(10,2) DEFAULT '10.00' NOT NULL;