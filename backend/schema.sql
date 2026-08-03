-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: task_app
-- ------------------------------------------------------
-- Server version	8.0.46

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
-- Table structure for table `task`
--

DROP TABLE IF EXISTS `task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task` (
  `taskID` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `description` varchar(2500) DEFAULT NULL,
  `deadline` datetime DEFAULT NULL,
  `userID` int NOT NULL,
  `status` varchar(12) NOT NULL,
  PRIMARY KEY (`taskID`),
  KEY `userID_idx` (`userID`),
  CONSTRAINT `userID` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task`
--

LOCK TABLES `task` WRITE;
/*!40000 ALTER TABLE `task` DISABLE KEYS */;
INSERT INTO `task` VALUES (4,'Ada','Ada','2026-08-05 00:00:00',7,'In-progress'),(5,'Brick','brick','2026-08-01 00:00:00',7,'Pending'),(7,'Asekk',NULL,NULL,7,'Completed'),(8,'Ase','ppp',NULL,6,'In-progress'),(9,'Ase',NULL,NULL,7,'Pending'),(10,'Aseee',NULL,NULL,7,'Pending'),(11,'dddd',NULL,NULL,7,'Pending'),(12,'asasa',NULL,NULL,7,'In-progress'),(14,'Adek',NULL,'2026-08-20 00:00:00',8,'In-progress');
/*!40000 ALTER TABLE `task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `userID` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` varchar(2000) NOT NULL,
  `email` varchar(250) NOT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Zaidan','','zaidanffaruq@gmail.com'),(2,'Admin01','','zaidanffaruq@gmail.com'),(3,'Abdul','$2b$10$VEp0pYL6qbA4uvn5e5NK4eFlX6RERWYCYzCA4YUuxBx7rtOQFfrrK','zaidanffaruq@gmail.com'),(4,'Brick','$2b$10$smj.K49fWXXCjxF4qmd9HeAcQ3GC2vishxUcvJSbmfRu670xTlYou','brick@gmail.com'),(5,'Jack','$2b$10$5fn3lj3vSjLdEKxzVvN4GuTydZs4JXXl/7YC5lFDpzVXMwSREtjMW','jack@gmail.com'),(6,'Karim','$2b$10$8ldtZOcTgYK0n8DxrU/VzuWTwwabdeHZe4.f.jUawyxQfKwlyD/VO','karim@gmail.com'),(7,'Bryan','$2b$10$N.8fERO6JSiPgdeOVEJqqOTiRsbH2R7FwZNTjqKfeMyjuvLihZrnG','bryan@gmail.com'),(8,'Dina','$2b$10$brtx3JRoL164l.IVYOYZvOGQYmWRkM8QXZfa4SihmVX/6hlIsOyhu','dina@gmail.com');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-03  7:54:00
