CREATE TABLE `wilborBabies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`birthDate` timestamp,
	`sex` enum('male','female','unknown') NOT NULL DEFAULT 'unknown',
	`weightGrams` int,
	`gestationalWeeks` int,
	`syndromes` text,
	`notes` text,
	`isActive` enum('true','false') NOT NULL DEFAULT 'true',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wilborBabies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wilborConversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`babyId` int,
	`category` enum('sono','colica','salto','alimentacao','seguranca','sos','geral') NOT NULL,
	`status` enum('active','completed') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wilborConversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wilborDevMilestones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`babyId` int NOT NULL,
	`weekNumber` int NOT NULL,
	`milestoneKey` varchar(100) NOT NULL,
	`achieved` enum('yes','no','partial') NOT NULL DEFAULT 'no',
	`achievedAt` timestamp,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `wilborDevMilestones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wilborDiaryEntries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`babyId` int NOT NULL,
	`entryDate` timestamp NOT NULL,
	`diaryCategory` enum('feeding','sleep','diaper','milestone','health','mood','general') NOT NULL DEFAULT 'general',
	`title` varchar(255),
	`content` text,
	`mood` enum('happy','calm','fussy','crying','sick'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wilborDiaryEntries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wilborKnowledgeBase` (
	`id` int AUTO_INCREMENT NOT NULL,
	`kbCategory` enum('sono','colica','amamentacao','salto','seguranca','febre','alimentacao','vacina','higiene_oral','motor','geral') NOT NULL,
	`ageRangeStart` int,
	`ageRangeEnd` int,
	`question` text NOT NULL,
	`keywords` text NOT NULL,
	`answerPt` text NOT NULL,
	`answerEn` text NOT NULL,
	`answerEs` text NOT NULL,
	`source` varchar(255) NOT NULL DEFAULT 'SBP 2024',
	`triggerValue` text,
	`medicalAlert` text,
	`imageUrl` text,
	`priority` int NOT NULL DEFAULT 0,
	`kbIsActive` enum('true','false') NOT NULL DEFAULT 'true',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wilborKnowledgeBase_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wilborMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`conversationId` int NOT NULL,
	`userId` int NOT NULL,
	`role` enum('user','assistant','system') NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `wilborMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wilborMotherProfile` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`heightCm` int NOT NULL,
	`prePregnancyWeightKg` int,
	`goalWeightKg` int,
	`deliveryType` enum('normal','cesarean') NOT NULL DEFAULT 'normal',
	`deliveryDate` timestamp,
	`isBreastfeeding` enum('true','false') NOT NULL DEFAULT 'true',
	`postpartumPhase` enum('resguardo','40dias','3meses','6meses','12meses') NOT NULL DEFAULT 'resguardo',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wilborMotherProfile_id` PRIMARY KEY(`id`),
	CONSTRAINT `wilborMotherProfile_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `wilborMotherWeighIns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`weightGrams` int NOT NULL,
	`measuredAt` timestamp NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `wilborMotherWeighIns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wilborRecipes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(500) NOT NULL,
	`ageMin` int NOT NULL DEFAULT 6,
	`recipeDifficulty` enum('Fácil','Médio','Difícil') NOT NULL DEFAULT 'Fácil',
	`prepTime` varchar(20) NOT NULL DEFAULT '30min',
	`ingredients` text NOT NULL,
	`allergens` text NOT NULL,
	`instructions` text NOT NULL,
	`textureGuide` text,
	`cutSafety` text,
	`safetyNote` text,
	`imageUrl` text,
	`recipeCategory` enum('refeicao','lanche','sobremesa','suco') NOT NULL DEFAULT 'refeicao',
	`recipeIsActive` enum('true','false') NOT NULL DEFAULT 'true',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wilborRecipes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wilborResponseFeedback` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`conversationId` int,
	`kbId` int,
	`userQuestion` text NOT NULL,
	`aiResponse` text NOT NULL,
	`helpfulness` enum('very_helpful','helpful','neutral','not_helpful','misleading') NOT NULL,
	`accuracy` enum('accurate','mostly_accurate','partially_accurate','inaccurate'),
	`comment` text,
	`feedbackLanguage` enum('pt','en','es') NOT NULL DEFAULT 'pt',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `wilborResponseFeedback_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wilborSleepLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`babyId` int NOT NULL,
	`sleepStart` timestamp NOT NULL,
	`sleepEnd` timestamp,
	`durationMinutes` int,
	`quality` enum('good','restless','bad'),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `wilborSleepLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wilborUserCredits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`plan` enum('free','premium','manual') NOT NULL DEFAULT 'free',
	`monthlyLimit` int NOT NULL DEFAULT 5,
	`messagesUsed` int NOT NULL DEFAULT 0,
	`stripeCustomerId` varchar(255),
	`stripeSubscriptionId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wilborUserCredits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wilborUsers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255) NOT NULL,
	`whatsapp` varchar(20),
	`city` varchar(100),
	`state` varchar(2),
	`babyName` varchar(255),
	`babyBirthDate` timestamp,
	`language` enum('pt','en','es') NOT NULL DEFAULT 'pt',
	`trialStartedAt` timestamp NOT NULL DEFAULT (now()),
	`trialExpiresAt` timestamp,
	`subscriptionStatus` enum('trial','active','expired','cancelled') NOT NULL DEFAULT 'trial',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastActiveAt` timestamp NOT NULL DEFAULT (now()),
	`messageCount` int NOT NULL DEFAULT 0,
	`rateLimitResetAt` timestamp,
	CONSTRAINT `wilborUsers_id` PRIMARY KEY(`id`),
	CONSTRAINT `wilborUsers_email_unique` UNIQUE(`email`)
);
