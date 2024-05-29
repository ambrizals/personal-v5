CREATE TABLE `pages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`uuid` varchar(150) NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` text NOT NULL,
	`content` text DEFAULT (''),
	`published` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `pages_id` PRIMARY KEY(`id`),
	CONSTRAINT `pages_uuid_unique` UNIQUE(`uuid`)
);
