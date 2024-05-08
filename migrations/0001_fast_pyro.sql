CREATE TABLE `articles` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`content` text DEFAULT (''),
	`cover` varchar(255),
	`thumbnail` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `articles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`label` varchar(150) NOT NULL,
	`slug` varchar(200) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `tags_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tag_articles` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`article_id` int unsigned NOT NULL,
	`tag_id` int unsigned,
	CONSTRAINT `tag_articles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `tag_articles` ADD CONSTRAINT `tag_articles_article_id_articles_id_fk` FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tag_articles` ADD CONSTRAINT `tag_articles_tag_id_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE no action ON UPDATE no action;