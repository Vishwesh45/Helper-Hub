CREATE DATABASE  IF NOT EXISTS `needy_service` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `needy_service`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: needy_service
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `f_id` int NOT NULL AUTO_INCREMENT,
  `provider_id` int DEFAULT NULL,
  `provider_name` varchar(255) DEFAULT NULL,
  `provider_username` varchar(255) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `user_username` varchar(255) DEFAULT NULL,
  `score` int DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`f_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `location` (
  `loc_id` int NOT NULL AUTO_INCREMENT,
  `location` varchar(255) NOT NULL,
  PRIMARY KEY (`loc_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `order_detail`
--

DROP TABLE IF EXISTS `order_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_detail` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `provider_id` int NOT NULL,
  `provider_name` varchar(255) NOT NULL,
  `provider_username` varchar(255) NOT NULL,
  `provider_mobile` varchar(20) NOT NULL,
  `service_id` int NOT NULL,
  `service_name` varchar(255) NOT NULL,
  `loc_id` int NOT NULL,
  `location` varchar(255) NOT NULL,
  `user_id` int NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_username` varchar(255) NOT NULL,
  `user_mobile` varchar(20) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `user_address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `service_provider_registration`
--

DROP TABLE IF EXISTS `service_provider_registration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_provider_registration` (
  `provider_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `mobile_number` varchar(20) NOT NULL,
  `service_id` int DEFAULT NULL,
  `service_name` varchar(50) DEFAULT NULL,
  `loc_id` int DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `service_certificate` blob,
  `username` varchar(20) DEFAULT NULL,
  `password` varchar(20) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`provider_id`),
  KEY `service_id` (`service_id`),
  KEY `loc_id` (`loc_id`),
  CONSTRAINT `service_provider_registration_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `services` (`service_id`),
  CONSTRAINT `service_provider_registration_ibfk_2` FOREIGN KEY (`loc_id`) REFERENCES `location` (`loc_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `service_id` int NOT NULL AUTO_INCREMENT,
  `service_name` varchar(255) NOT NULL,
  PRIMARY KEY (`service_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_registration`
--

DROP TABLE IF EXISTS `user_registration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_registration` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `mobile_number` varchar(10) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'needy_service'
--

--
-- Dumping routines for database 'needy_service'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-28 10:01:20
