-- MySQL dump 10.13  Distrib 9.6.0, for macos26.3 (arm64)
--
-- Host: localhost    Database: db_logbook_ioh
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action` enum('CREATE','UPDATE','DELETE') NOT NULL,
  `entityId` int DEFAULT NULL COMMENT 'ID dari Business Case yang dikenai aksi',
  `bcCode` varchar(255) DEFAULT NULL COMMENT 'BC Code saat aksi dilakukan (snapshot)',
  `bcTitle` varchar(255) DEFAULT NULL COMMENT 'BC Title saat aksi dilakukan (snapshot)',
  `userId` int NOT NULL,
  `description` text COMMENT 'Deskripsi singkat aksi yang dilakukan',
  `createdAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `business_case_sales_teams`
--

DROP TABLE IF EXISTS `business_case_sales_teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_case_sales_teams` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `businessCaseId` int NOT NULL,
  `salesTeamId` int NOT NULL,
  PRIMARY KEY (`businessCaseId`,`salesTeamId`),
  KEY `salesTeamId` (`salesTeamId`),
  CONSTRAINT `business_case_sales_teams_ibfk_1` FOREIGN KEY (`businessCaseId`) REFERENCES `business_cases` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `business_case_sales_teams_ibfk_2` FOREIGN KEY (`salesTeamId`) REFERENCES `sales_teams` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `business_cases`
--

DROP TABLE IF EXISTS `business_cases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_cases` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bcCode` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bcTitle` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bcType` enum('Non-BC','BC-CPB','BC') COLLATE utf8mb4_unicode_ci NOT NULL,
  `cpbDate` date DEFAULT NULL,
  `projectType` enum('Non-Tender','Tender') COLLATE utf8mb4_unicode_ci NOT NULL,
  `activityType` enum('BAU','Non BAU') COLLATE utf8mb4_unicode_ci NOT NULL,
  `projectStatus` enum('On Progress','Win','Lost','Drop Exp','Drop Sls','Double','Cancel') COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastFollowUpDate` datetime DEFAULT NULL,
  `followUpNotes` text COLLATE utf8mb4_unicode_ci,
  `esReqDate` date NOT NULL,
  `cfDate` date NOT NULL,
  `dueDate` date DEFAULT NULL,
  `sfalId` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `opportunityId` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `salesOrder` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quote` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `custName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `custJoinYear` int DEFAULT NULL,
  `lineOfBusiness` enum('Agriculture, Forestry Management','Agriculture, Livestock and Fisheries','Hunting/Wildlife Conservation','Business Services','Communication','Technology','Education Services','Mining & Quarrying','Mining, Oil & Gas Support Services','Oil & Gas','Public Utilities','Banking','Non - Bank Financial','Government','Health Services','Hotel','Restaurant','Broadcaster','Media','Non Profit Organization','Building Service,Architect & Eng.','Construction','Engineering, Procurement & Construction','Property Developer','Real Estate','Distribution','Logistic','Manufacturing','Trading and Retailer','Transport Service','Transportation') COLLATE utf8mb4_unicode_ci NOT NULL,
  `contractType` enum('Existing','New') COLLATE utf8mb4_unicode_ci NOT NULL,
  `activationType` enum('New','Additional','Renewal','Upgrade','Relocated','Downgrade','Reconfiguration') COLLATE utf8mb4_unicode_ci NOT NULL,
  `rfsDate` date NOT NULL,
  `contractPeriod` enum('1','12','24','36','48','60','Other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `otc` bigint DEFAULT NULL,
  `mrc` bigint DEFAULT NULL,
  `tcv` bigint DEFAULT NULL,
  `totalNetRev` bigint DEFAULT NULL,
  `portOnlyRev` bigint DEFAULT NULL,
  `y1RevCalendar` bigint DEFAULT NULL,
  `y1RevYearly` bigint DEFAULT NULL,
  `pprEligibility` enum('Eligible','Not Eligible') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pprStatus` enum('On Progress','Done') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `y1CoS` bigint DEFAULT NULL,
  `totalCoS` bigint DEFAULT NULL,
  `networkOpex` bigint DEFAULT NULL,
  `directOpex` bigint DEFAULT NULL,
  `otherOpexDirect` bigint DEFAULT NULL,
  `indirectOpex` bigint DEFAULT NULL,
  `financingCost` bigint DEFAULT NULL,
  `marketingCost` bigint DEFAULT NULL,
  `riskCost` bigint DEFAULT NULL,
  `b2bDirectOverhead` bigint DEFAULT NULL,
  `iohOverheadAllocation` bigint DEFAULT NULL,
  `contributionMargin` bigint DEFAULT NULL,
  `totalCapex` bigint DEFAULT NULL,
  `totalOpex` bigint DEFAULT NULL,
  `ebitda` bigint DEFAULT NULL,
  `ebitdaMargin` double DEFAULT NULL,
  `netProfit` bigint DEFAULT NULL,
  `totalFcf` bigint DEFAULT NULL,
  `totalAccFcf` bigint DEFAULT NULL,
  `wacc` double DEFAULT NULL,
  `npv` bigint DEFAULT NULL,
  `irr` double DEFAULT NULL,
  `payback` double DEFAULT NULL,
  `fileName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filePath` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileUploadedAt` datetime DEFAULT NULL,
  `userId` int NOT NULL,
  `pricingTeamId` int NOT NULL,
  `preSalesTeamId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `bcCode` (`bcCode`),
  UNIQUE KEY `bcCode_2` (`bcCode`),
  UNIQUE KEY `bcCode_3` (`bcCode`),
  UNIQUE KEY `bcCode_4` (`bcCode`),
  UNIQUE KEY `bcCode_5` (`bcCode`),
  UNIQUE KEY `bcCode_6` (`bcCode`),
  UNIQUE KEY `bcCode_7` (`bcCode`),
  UNIQUE KEY `bcCode_8` (`bcCode`),
  UNIQUE KEY `bcCode_9` (`bcCode`),
  UNIQUE KEY `bcCode_10` (`bcCode`),
  UNIQUE KEY `bcCode_11` (`bcCode`),
  UNIQUE KEY `bcCode_12` (`bcCode`),
  UNIQUE KEY `bcCode_13` (`bcCode`),
  UNIQUE KEY `bcCode_14` (`bcCode`),
  UNIQUE KEY `bcCode_15` (`bcCode`),
  UNIQUE KEY `bcCode_16` (`bcCode`),
  UNIQUE KEY `bcCode_17` (`bcCode`),
  UNIQUE KEY `bcCode_18` (`bcCode`),
  UNIQUE KEY `bcCode_19` (`bcCode`),
  UNIQUE KEY `bcCode_20` (`bcCode`),
  UNIQUE KEY `bcCode_21` (`bcCode`),
  UNIQUE KEY `bcCode_22` (`bcCode`),
  UNIQUE KEY `bcCode_23` (`bcCode`),
  UNIQUE KEY `bcCode_24` (`bcCode`),
  UNIQUE KEY `bcCode_25` (`bcCode`),
  UNIQUE KEY `bcCode_26` (`bcCode`),
  UNIQUE KEY `bcCode_27` (`bcCode`),
  UNIQUE KEY `bcCode_28` (`bcCode`),
  UNIQUE KEY `bcCode_29` (`bcCode`),
  UNIQUE KEY `bcCode_30` (`bcCode`),
  UNIQUE KEY `bcCode_31` (`bcCode`),
  UNIQUE KEY `bcCode_32` (`bcCode`),
  UNIQUE KEY `bcCode_33` (`bcCode`),
  UNIQUE KEY `bcCode_34` (`bcCode`),
  UNIQUE KEY `bcCode_35` (`bcCode`),
  UNIQUE KEY `bcCode_36` (`bcCode`),
  UNIQUE KEY `bcCode_37` (`bcCode`),
  UNIQUE KEY `bcCode_38` (`bcCode`),
  UNIQUE KEY `bcCode_39` (`bcCode`),
  UNIQUE KEY `bcCode_40` (`bcCode`),
  UNIQUE KEY `bcCode_41` (`bcCode`),
  UNIQUE KEY `bcCode_42` (`bcCode`),
  UNIQUE KEY `bcCode_43` (`bcCode`),
  UNIQUE KEY `bcCode_44` (`bcCode`),
  UNIQUE KEY `bcCode_45` (`bcCode`),
  UNIQUE KEY `bcCode_46` (`bcCode`),
  UNIQUE KEY `bcCode_47` (`bcCode`),
  UNIQUE KEY `bcCode_48` (`bcCode`),
  UNIQUE KEY `bcCode_49` (`bcCode`),
  UNIQUE KEY `bcCode_50` (`bcCode`),
  UNIQUE KEY `bcCode_51` (`bcCode`),
  UNIQUE KEY `bcCode_52` (`bcCode`),
  UNIQUE KEY `bcCode_53` (`bcCode`),
  UNIQUE KEY `bcCode_54` (`bcCode`),
  UNIQUE KEY `bcCode_55` (`bcCode`),
  UNIQUE KEY `bcCode_56` (`bcCode`),
  UNIQUE KEY `bcCode_57` (`bcCode`),
  UNIQUE KEY `bcCode_58` (`bcCode`),
  UNIQUE KEY `bcCode_59` (`bcCode`),
  UNIQUE KEY `bcCode_60` (`bcCode`),
  KEY `userId` (`userId`),
  KEY `pricingTeamId` (`pricingTeamId`),
  KEY `preSalesTeamId` (`preSalesTeamId`),
  CONSTRAINT `business_cases_ibfk_174` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `business_cases_ibfk_175` FOREIGN KEY (`pricingTeamId`) REFERENCES `pricing_teams` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `business_cases_ibfk_176` FOREIGN KEY (`preSalesTeamId`) REFERENCES `pre_sales_teams` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16521 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `divisionId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `divisionId` (`divisionId`),
  CONSTRAINT `departments_ibfk_1` FOREIGN KEY (`divisionId`) REFERENCES `divisions` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `divisions`
--

DROP TABLE IF EXISTS `divisions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `divisions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `groupId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `groupId` (`groupId`),
  CONSTRAINT `divisions_ibfk_1` FOREIGN KEY (`groupId`) REFERENCES `groups` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pre_sales_teams`
--

DROP TABLE IF EXISTS `pre_sales_teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pre_sales_teams` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pricing_teams`
--

DROP TABLE IF EXISTS `pricing_teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pricing_teams` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sales_teams`
--

DROP TABLE IF EXISTS `sales_teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_teams` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `departmentId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `departmentId` (`departmentId`),
  CONSTRAINT `sales_teams_ibfk_1` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `service_details`
--

DROP TABLE IF EXISTS `service_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `serviceSegment` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `totalUnit` int DEFAULT NULL,
  `detailService` text COLLATE utf8mb4_unicode_ci,
  `serviceLocation` enum('Jawa-Bali','Kalimantan','Sulawesi','Sumatera') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `locationA` enum('Jawa-Bali','Kalimantan','Sulawesi','Sumatera') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `locationB` enum('Jawa-Bali','Kalimantan','Sulawesi','Sumatera') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `totalBwPerMbps` int DEFAULT NULL,
  `pricePerMbps` bigint DEFAULT NULL,
  `infraType` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `infraNotes` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `businessCaseId` int NOT NULL,
  `serviceId` int NOT NULL,
  `subServiceId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `businessCaseId` (`businessCaseId`),
  KEY `serviceId` (`serviceId`),
  CONSTRAINT `service_details_ibfk_115` FOREIGN KEY (`businessCaseId`) REFERENCES `business_cases` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `service_details_ibfk_116` FOREIGN KEY (`serviceId`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `infraType` enum('Onnet','Offnet') DEFAULT NULL,
  `infraNotes` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `serviceCategory` enum('TelCo','TechCo') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sub_services`
--

DROP TABLE IF EXISTS `sub_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sub_services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `serviceId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `serviceId` (`serviceId`),
  CONSTRAINT `sub_services_ibfk_1` FOREIGN KEY (`serviceId`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tender_details`
--

DROP TABLE IF EXISTS `tender_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tender_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `winnerName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `winningPrice` bigint NOT NULL,
  `lostReason` enum('Pricing','Undisclosed','Technical') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `businessCaseId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `businessCaseId` (`businessCaseId`),
  CONSTRAINT `tender_details_ibfk_1` FOREIGN KEY (`businessCaseId`) REFERENCES `business_cases` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `firstName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('Admin','Staf','AVP & VP') COLLATE utf8mb4_unicode_ci NOT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `username_2` (`username`),
  UNIQUE KEY `username_3` (`username`),
  UNIQUE KEY `username_4` (`username`),
  UNIQUE KEY `username_5` (`username`),
  UNIQUE KEY `username_6` (`username`),
  UNIQUE KEY `username_7` (`username`),
  UNIQUE KEY `username_8` (`username`),
  UNIQUE KEY `username_9` (`username`),
  UNIQUE KEY `username_10` (`username`),
  UNIQUE KEY `username_11` (`username`),
  UNIQUE KEY `username_12` (`username`),
  UNIQUE KEY `username_13` (`username`),
  UNIQUE KEY `username_14` (`username`),
  UNIQUE KEY `username_15` (`username`),
  UNIQUE KEY `username_16` (`username`),
  UNIQUE KEY `username_17` (`username`),
  UNIQUE KEY `username_18` (`username`),
  UNIQUE KEY `username_19` (`username`),
  UNIQUE KEY `username_20` (`username`),
  UNIQUE KEY `username_21` (`username`),
  UNIQUE KEY `username_22` (`username`),
  UNIQUE KEY `username_23` (`username`),
  UNIQUE KEY `username_24` (`username`),
  UNIQUE KEY `username_25` (`username`),
  UNIQUE KEY `username_26` (`username`),
  UNIQUE KEY `username_27` (`username`),
  UNIQUE KEY `username_28` (`username`),
  UNIQUE KEY `username_29` (`username`),
  UNIQUE KEY `username_30` (`username`),
  UNIQUE KEY `username_31` (`username`),
  UNIQUE KEY `username_32` (`username`),
  UNIQUE KEY `username_33` (`username`),
  UNIQUE KEY `username_34` (`username`),
  UNIQUE KEY `username_35` (`username`),
  UNIQUE KEY `username_36` (`username`),
  UNIQUE KEY `username_37` (`username`),
  UNIQUE KEY `username_38` (`username`),
  UNIQUE KEY `username_39` (`username`),
  UNIQUE KEY `username_40` (`username`),
  UNIQUE KEY `username_41` (`username`),
  UNIQUE KEY `username_42` (`username`),
  UNIQUE KEY `username_43` (`username`),
  UNIQUE KEY `username_44` (`username`),
  UNIQUE KEY `username_45` (`username`),
  UNIQUE KEY `username_46` (`username`),
  UNIQUE KEY `username_47` (`username`),
  UNIQUE KEY `username_48` (`username`),
  UNIQUE KEY `username_49` (`username`),
  UNIQUE KEY `username_50` (`username`),
  UNIQUE KEY `username_51` (`username`),
  UNIQUE KEY `username_52` (`username`),
  UNIQUE KEY `username_53` (`username`),
  UNIQUE KEY `username_54` (`username`),
  UNIQUE KEY `username_55` (`username`),
  UNIQUE KEY `username_56` (`username`),
  UNIQUE KEY `username_57` (`username`),
  UNIQUE KEY `username_58` (`username`),
  UNIQUE KEY `username_59` (`username`),
  UNIQUE KEY `username_60` (`username`),
  UNIQUE KEY `username_61` (`username`),
  UNIQUE KEY `username_62` (`username`),
  UNIQUE KEY `username_63` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-21 12:12:10
