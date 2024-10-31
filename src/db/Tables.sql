/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE IF NOT EXISTS `send-help` /*!40100 DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci */;
USE `send-help`;

CREATE TABLE IF NOT EXISTS `comment` (
  `commentId` int(11) NOT NULL AUTO_INCREMENT,
  `message` text NOT NULL,
  `created` datetime NOT NULL DEFAULT current_timestamp(),
  `userId` varchar(50) NOT NULL,
  `ticketId` int(11) NOT NULL,
  PRIMARY KEY (`commentId`),
  KEY `FK__ticket` (`ticketId`),
  KEY `FK_comment_user` (`userId`),
  CONSTRAINT `FK__ticket` FOREIGN KEY (`ticketId`) REFERENCES `ticket` (`ticketId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_comment_user` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

CREATE TABLE IF NOT EXISTS `file` (
  `fileId` int(11) NOT NULL AUTO_INCREMENT,
  `commentId` int(11) DEFAULT NULL,
  `mime` varchar(50) DEFAULT NULL,
  `name` varchar(127) DEFAULT NULL,
  `filename` varchar(255) DEFAULT NULL,
  `thumb` varchar(127) DEFAULT NULL,
  PRIMARY KEY (`fileId`),
  KEY `FK_file_comment` (`commentId`),
  CONSTRAINT `FK_file_comment` FOREIGN KEY (`commentId`) REFERENCES `comment` (`commentId`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

CREATE TABLE IF NOT EXISTS `team` (
  `teamId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`teamId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

CREATE TABLE IF NOT EXISTS `ticket` (
  `ticketId` int(11) NOT NULL AUTO_INCREMENT,
  `subject` varchar(127) NOT NULL DEFAULT '',
  `message` text NOT NULL DEFAULT '',
  `priority` int(11) NOT NULL DEFAULT 1,
  `risk` int(11) NOT NULL DEFAULT 1,
  `created` datetime NOT NULL DEFAULT current_timestamp(),
  `typeId` int(11) NOT NULL DEFAULT 0,
  `statusId` int(11) DEFAULT NULL,
  `teamId` int(11) NOT NULL,
  `owner` varchar(50) NOT NULL,
  PRIMARY KEY (`ticketId`),
  KEY `FK_ticket_tickettype` (`typeId`),
  KEY `FK_ticket_team` (`teamId`),
  KEY `FK_ticket_ticket_status` (`statusId`) USING BTREE,
  KEY `FK_ticket_user` (`owner`) USING BTREE,
  CONSTRAINT `FK_ticket_team` FOREIGN KEY (`teamId`) REFERENCES `team` (`teamId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_ticket_ticket_status` FOREIGN KEY (`statusId`) REFERENCES `ticket_status` (`ticketStatusId`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `FK_ticket_tickettype` FOREIGN KEY (`typeId`) REFERENCES `ticket_type` (`ticketTypeId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_ticket_user` FOREIGN KEY (`owner`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

CREATE TABLE IF NOT EXISTS `ticket_status` (
  `ticketStatusId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`ticketStatusId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

CREATE TABLE IF NOT EXISTS `ticket_type` (
  `ticketTypeId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`ticketTypeId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

CREATE TABLE IF NOT EXISTS `user` (
  `userId` varchar(50) NOT NULL,
  `fn` varchar(50) NOT NULL DEFAULT '',
  `ln` varchar(50) NOT NULL DEFAULT '',
  `permissions` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

CREATE TABLE IF NOT EXISTS `user_team` (
  `userId` varchar(50) NOT NULL DEFAULT '',
  `teamId` int(11) NOT NULL,
  KEY `FK__user` (`userId`),
  KEY `FK_user_team_team` (`teamId`),
  CONSTRAINT `FK__user` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_user_team_team` FOREIGN KEY (`teamId`) REFERENCES `team` (`teamId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
