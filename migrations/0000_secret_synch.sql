CREATE TABLE `users` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`username` varchar(255) NOT NULL,
	`password` text NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
