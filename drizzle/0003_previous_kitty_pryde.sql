CREATE TABLE `blogArticles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`content` text NOT NULL,
	`blogCategory` enum('sono','colica','febre','alimentacao','depressao_pos_parto','vacinas','amamentacao','seguranca','saltos','higiene') NOT NULL,
	`imageUrl` text,
	`author` varchar(100) NOT NULL DEFAULT 'Wilbor Assist',
	`seoKeywords` text,
	`seoMetaDescription` text,
	`readTimeMinutes` int NOT NULL DEFAULT 5,
	`views` int NOT NULL DEFAULT 0,
	`isPublished` enum('true','false') NOT NULL DEFAULT 'true',
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blogArticles_id` PRIMARY KEY(`id`),
	CONSTRAINT `blogArticles_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `blogComments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`articleId` int NOT NULL,
	`userId` int,
	`name` varchar(100) NOT NULL,
	`email` varchar(320),
	`content` text NOT NULL,
	`isApproved` enum('true','false') NOT NULL DEFAULT 'false',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `blogComments_id` PRIMARY KEY(`id`)
);
