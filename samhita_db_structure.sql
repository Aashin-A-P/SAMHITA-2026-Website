-- MySQL schema for samhita_db

CREATE DATABASE IF NOT EXISTS `samhita_db`;
USE `samhita_db`;

-- Users table
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` varchar(5) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `dob` date DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `college` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `yearofPassing` int DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`email`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  CONSTRAINT `users_id_format` CHECK (`id` REGEXP '^S[0-9]{4}$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Sequence table for generating S0001..S9999
DROP TABLE IF EXISTS `user_id_sequence`;
CREATE TABLE `user_id_sequence` (
  `id` tinyint NOT NULL,
  `last_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `user_id_sequence` (`id`, `last_id`) VALUES (1, 0);

-- Trigger to auto-generate user IDs
DROP TRIGGER IF EXISTS `users_before_insert`;
DELIMITER ;;
CREATE TRIGGER `users_before_insert`
BEFORE INSERT ON `users`
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    UPDATE `user_id_sequence` SET `last_id` = `last_id` + 1 WHERE `id` = 1;
    IF (SELECT `last_id` FROM `user_id_sequence` WHERE `id` = 1) > 9999 THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User ID limit reached (S9999)';
    END IF;
    SET NEW.id = CONCAT('S', LPAD((SELECT `last_id` FROM `user_id_sequence` WHERE `id` = 1), 4, '0'));
  END IF;
END;;
DELIMITER ;

-- Organizers table
DROP TABLE IF EXISTS `organizers`;
CREATE TABLE `organizers` (
  `id` varchar(3) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobile` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  CONSTRAINT `organizers_id_format` CHECK (`id` REGEXP '^O[0-9]{2}$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Sequence table for generating O01..O99
DROP TABLE IF EXISTS `organizer_id_sequence`;
CREATE TABLE `organizer_id_sequence` (
  `id` tinyint NOT NULL,
  `last_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `organizer_id_sequence` (`id`, `last_id`) VALUES (1, 0);

-- Trigger to auto-generate organizer IDs
DROP TRIGGER IF EXISTS `organizers_before_insert`;
DELIMITER ;;
CREATE TRIGGER `organizers_before_insert`
BEFORE INSERT ON `organizers`
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    UPDATE `organizer_id_sequence` SET `last_id` = `last_id` + 1 WHERE `id` = 1;
    IF (SELECT `last_id` FROM `organizer_id_sequence` WHERE `id` = 1) > 99 THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Organizer ID limit reached (O99)';
    END IF;
    SET NEW.id = CONCAT('O', LPAD((SELECT `last_id` FROM `organizer_id_sequence` WHERE `id` = 1), 2, '0'));
  END IF;
END;;
DELIMITER ;

-- Events table
DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `eventName` varchar(255) NOT NULL,
  `eventCategory` varchar(255) NOT NULL,
  `eventDescription` text NOT NULL,
  `numberOfRounds` int NOT NULL,
  `teamOrIndividual` enum('Team','Individual') NOT NULL,
  `location` varchar(255) NOT NULL,
  `registrationFees` int NOT NULL,
  `coordinatorName` varchar(255) NOT NULL,
  `coordinatorContactNo` varchar(20) NOT NULL,
  `coordinatorMail` varchar(255) NOT NULL,
  `lastDateForRegistration` datetime NOT NULL,
  `posterImage` longblob,
  `open_to_non_mit` tinyint(1) DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `discountPercentage` int DEFAULT '0',
  `discountReason` varchar(255) DEFAULT NULL,
  `mit_discount_percentage` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Accounts table
DROP TABLE IF EXISTS `accounts`;
CREATE TABLE `accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `accountName` varchar(255) NOT NULL,
  `bankName` varchar(255) NOT NULL,
  `accountNumber` varchar(255) NOT NULL,
  `ifscCode` varchar(255) NOT NULL,
  `qrCodePdf` longblob,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Passes table
DROP TABLE IF EXISTS `passes`;
CREATE TABLE `passes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `cost` int NOT NULL,
  `pass_limit` int NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `description` text,
  `accountId` int DEFAULT NULL,
  `discountPercentage` int DEFAULT '0',
  `discountReason` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `accountId` (`accountId`),
  CONSTRAINT `passes_ibfk_1` FOREIGN KEY (`accountId`) REFERENCES `accounts` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Coupons table
DROP TABLE IF EXISTS `coupons`;
CREATE TABLE `coupons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `limit` int NOT NULL,
  `discount_percent` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Workshops table
DROP TABLE IF EXISTS `workshops`;
CREATE TABLE `workshops` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `cost` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Offers table
DROP TABLE IF EXISTS `offers`;
CREATE TABLE `offers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` text,
  `active` tinyint(1) DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Pass cart table (like pass_cart in csmit_db)
DROP TABLE IF EXISTS `pass_cart`;
CREATE TABLE `pass_cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(5) NOT NULL,
  `passId` int NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userId_passId_UNIQUE` (`userId`,`passId`),
  KEY `passId` (`passId`),
  CONSTRAINT `pass_cart_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pass_cart_ibfk_2` FOREIGN KEY (`passId`) REFERENCES `passes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Cart table (same as csmit_db cart)
DROP TABLE IF EXISTS `cart`;
CREATE TABLE `cart` (
  `cartId` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(5) NOT NULL,
  `eventId` int NOT NULL,
  `symposiumName` varchar(255) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`cartId`),
  KEY `userId` (`userId`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Rounds table (similar to enigma_rounds)
DROP TABLE IF EXISTS `rounds`;
CREATE TABLE `rounds` (
  `id` int NOT NULL AUTO_INCREMENT,
  `eventId` int NOT NULL,
  `roundNumber` int NOT NULL,
  `roundDetails` text NOT NULL,
  `roundDateTime` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `eventId` (`eventId`),
  CONSTRAINT `rounds_ibfk_1` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Registration timer table
DROP TABLE IF EXISTS `registration_timer`;
CREATE TABLE `registration_timer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `end_time` datetime NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Symposium status table
DROP TABLE IF EXISTS `symposium_status`;
CREATE TABLE `symposium_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `symposiumName` varchar(255) NOT NULL,
  `isOpen` tinyint(1) DEFAULT '0',
  `startDate` date DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `symposiumName` (`symposiumName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Verified registrations table
DROP TABLE IF EXISTS `verified_registrations`;
CREATE TABLE `verified_registrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(5) NOT NULL,
  `eventId` int DEFAULT NULL,
  `passId` int DEFAULT NULL,
  `verified` tinyint(1) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `confirmation_email_sent` tinyint(1) DEFAULT '0',
  `transactionId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `verified_registrations_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

UPDATE symposium_status
SET startDate = '2026-02-13'
WHERE symposiumName = 'SAMHITA';
