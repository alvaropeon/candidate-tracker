-- MySQL dump 10.13  Distrib 5.6.20, for osx10.9 (x86_64)
--
-- Host: localhost    Database: hpcloudrecruiting
-- ------------------------------------------------------
-- Server version	5.6.20

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Candidate`
--

/*DROP TABLE IF EXISTS `Candidate`;*/

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE if not exists `Candidate` (
  `CandidateId` int(11) NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(500) DEFAULT NULL,
  `LastName` varchar(500) DEFAULT NULL,
  `Notes` varchar(5000) DEFAULT NULL,
  `EmailAddress` varchar(5000) DEFAULT NULL,
  `Position_PositionId` int(11) NOT NULL,
  `Recruiter_PersonId` int(11) NOT NULL,
  `Owner_PersonId` int(11) NOT NULL,
  `CurrentStage` int(11) DEFAULT NULL,
  `DueDate` datetime DEFAULT NULL,
  `LastModified` datetime,
  `TagLine` varchar(5000) DEFAULT NULL,
  PRIMARY KEY (`CandidateId`),
  UNIQUE KEY `CandidateId_UNIQUE` (`CandidateId`),
  KEY `fk_Candidate_Position1_idx` (`Position_PositionId`),
  CONSTRAINT `fk_Candidate_Position1` FOREIGN KEY (`Position_PositionId`) REFERENCES `Position` (`PositionId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  KEY `fk_Candidate_Recruiter_idx` (`Recruiter_PersonId`),
  CONSTRAINT `fk_Candidate_Recruiter` FOREIGN KEY (`Recruiter_PersonId`) REFERENCES `Person` (`PersonId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  KEY `fk_Candidate_Owner_idx` (`Owner_PersonId`),
  CONSTRAINT `fk_Candidate_Owner` FOREIGN KEY (`Owner_PersonId`) REFERENCES `Person` (`PersonId`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Candidate`
--

/* LOCK TABLES `Candidate` WRITE;
/*!40000 ALTER TABLE `Candidate` DISABLE KEYS */;
INSERT INTO `Candidate` VALUES (1,'Bob','Peterson','Very talented UX designer','bob_peterson@hp.com',1,1,1,1,CURDATE() + INTERVAL 12 DAY,1, 'The best in the biz');
INSERT INTO `Candidate` VALUES (2,'Mary','Johnson','Star cloud dev','mary.johnson@example.com',1,1,1,1,CURDATE() + INTERVAL 12 DAY,1, 'The best in the biz');
INSERT INTO `Candidate` VALUES (3,'John','Smith','Experienced network engineer','john.smith@example.com',1,1,1,1,CURDATE() + INTERVAL 12 DAY,2, 'The best in the biz');
INSERT INTO `Candidate` VALUES (4,'Jane','Jones','Experienced network engineer','jane.jones@example.com',1,1,1,1,CURDATE() + INTERVAL 12 DAY,3, 'The best in the biz');
/*!40000 ALTER TABLE `Candidate` ENABLE KEYS */;
UNLOCK TABLES;
*/

--
-- Table structure for table `Role`
--

DROP TABLE IF EXISTS `Role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Role` (
  `RoleId` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(5000) DEFAULT NULL,
  `Description` varchar(5000) DEFAULT NULL,
  PRIMARY KEY (`RoleId`),
  UNIQUE KEY `Id_UNIQUE` (`RoleId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Role`
--

LOCK TABLES `Role` WRITE;
/*!40000 ALTER TABLE `Role` DISABLE KEYS */;
INSERT INTO `Role` VALUES (1,'Hiring Manager','Hiring Manager'),(2,'Recruiter','Recruiter');
/*!40000 ALTER TABLE `Role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Person`
--

DROP TABLE IF EXISTS `Person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Person` (
  `FirstName` varchar(5000) DEFAULT NULL,
  `LastName` varchar(5000) DEFAULT NULL,
  `EmailAddress` varchar(5000) DEFAULT NULL,
  `Role_RoleId` int(11) NOT NULL,
  `PersonId` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`PersonId`),
  UNIQUE KEY `PersonId_UNIQUE` (`PersonId`),
  KEY `fk_Person_Role_idx` (`Role_RoleId`),
  CONSTRAINT `fk_Person_Role` FOREIGN KEY (`Role_RoleId`) REFERENCES `Role` (`RoleId`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Person`
--

LOCK TABLES `Person` WRITE;
/*!40000 ALTER TABLE `Person` DISABLE KEYS */;
INSERT INTO `Person` VALUES ('Smith','Jack','jack.smith@example.com',1,1),('Doe','Joe','joe.doe@example.com',2,2);
/*!40000 ALTER TABLE `Person` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Position`
--

DROP TABLE IF EXISTS `Position`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Position` (
  `PositionId` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(5000) DEFAULT NULL,
  `Description` varchar(5000) DEFAULT NULL,
  `DatePosted` datetime,
  `JobLink` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`PositionId`),
  UNIQUE KEY `Id_UNIQUE` (`PositionId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Position`
--

LOCK TABLES `Position` WRITE;
/*!40000 ALTER TABLE `Position` DISABLE KEYS */;
INSERT INTO `Position` VALUES (2,'Senior SDE','Senior SDE','2014-10-29 16:46:31','Senior SDE'),(3,'Distinguished Technologist','Distinguished Technologist','2014-10-29 16:57:38','Distinguished Technologist Link');
/*!40000 ALTER TABLE `Position` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `State`
--

DROP TABLE IF EXISTS `State`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `State` (
  `StageId` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(5000) DEFAULT NULL,
  `Description` varchar(5000) DEFAULT NULL,
  `Order` int(11) NOT NULL,
  PRIMARY KEY (`StageId`),
  UNIQUE KEY `StageId_UNIQUE` (`StageId`),
  UNIQUE KEY `Order_UNIQUE` (`Order`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `State`
--

LOCK TABLES `State` WRITE;
/*!40000 ALTER TABLE `State` DISABLE KEYS */;
INSERT INTO `State` VALUES (1,'Lead','Candidaate entered into the system',1),(2,'Phone Screen','Candidaate entered into the system',2),(3,'Interview','Candidaate entered into the system',3),(4,'Offer','Candidaate entered into the system',4),(5,'Accepted','Candidaate entered into the system',5),(6,'Withdrawn','Candidaate entered into the system',6),(7,'Rejected','Candidaate entered into the system',7);
/*!40000 ALTER TABLE `State` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'hpcloudrecruiting'
--
DROP PROCEDURE IF EXISTS `uspChangeState`;

DELIMITER ;;

CREATE PROCEDURE `uspChangeState`(IN pCandidateId INT, IN pStateId INT)
BEGIN

 UPDATE Candidate

 SET    CurrentStage = pStateId

 WHERE  CandidateId  = pCandidateId;

SELECT CandidateId,
       C.FirstName,
       C.LastName,
       TagLine,
       Notes,
       JobLink,
       C.EmailAddress,
       LastModified,
       DueDate,
       P.Name,
       S.StageId,
       S.name AS 'State_Name',
       R.FirstName AS 'Recruiter_Name',
       C.Recruiter_PersonId,
       C.Owner_PersonId,
       O.FirstName AS 'Owner_Name'
  FROM  Candidate C
  INNER JOIN Position P ON P.PositionID = C.Position_PositionId
  INNER JOIN State S ON S.StageId = C.CurrentStage
  INNER JOIN Person R ON R.PersonId = C.Recruiter_PersonId
  INNER JOIN Person O ON O.PersonId = C.Owner_PersonId
  WHERE C.CandidateId = pCandidateId;
END ;;

DELIMITER ;

--
-- Dumping routines for database 'hpcloudrecruiting'
--
DROP PROCEDURE IF EXISTS `uspChangeOwner`;

DELIMITER ;;

CREATE PROCEDURE `uspChangeOwner`(IN pCandidateId INT, IN pPersonId INT)
BEGIN

 UPDATE Candidate

 SET    Owner_PersonId = pPersonId

 WHERE  CandidateId  = pCandidateId;

SELECT CandidateId,
       C.FirstName,
       C.LastName,
       TagLine,
       Notes,
       JobLink,
       C.EmailAddress,
       LastModified,
       DueDate,
       P.Name,
       S.StageId,
       S.name AS 'State_Name',
       R.FirstName AS 'Recruiter_Name',
       C.Recruiter_PersonId,
       C.Owner_PersonId,
       O.FirstName AS 'Owner_Name'
  FROM  Candidate C
  INNER JOIN Position P ON P.PositionID = C.Position_PositionId
  INNER JOIN State S ON S.StageId = C.CurrentStage
  INNER JOIN Person R ON R.PersonId = C.Recruiter_PersonId
  INNER JOIN Person O ON O.PersonId = C.Owner_PersonId
  WHERE C.CandidateId = pCandidateId;
END ;;

DELIMITER ;
--
-- Dumping routines for database 'hpcloudrecruiting'
--
DROP PROCEDURE IF EXISTS `uspChangeDueDate`;

DELIMITER ;;

CREATE PROCEDURE `uspChangeDueDate`(IN pCandidateId INT, IN pNewDueDate datetime)
BEGIN

 UPDATE Candidate

 SET    DueDate = pNewDueDate

 WHERE  CandidateId  = pCandidateId;

SELECT CandidateId,
       C.FirstName,
       C.LastName,
       TagLine,
       Notes,
       JobLink,
       C.EmailAddress,
       LastModified,
       DueDate,
       P.Name,
       S.StageId,
       S.name AS 'State_Name',
       R.FirstName AS 'Recruiter_Name',
       C.Recruiter_PersonId,
       C.Owner_PersonId,
       O.FirstName AS 'Owner_Name'
  FROM  Candidate C
  INNER JOIN Position P ON P.PositionID = C.Position_PositionId
  INNER JOIN State S ON S.StageId = C.CurrentStage
  INNER JOIN Person R ON R.PersonId = C.Recruiter_PersonId
  INNER JOIN Person O ON O.PersonId = C.Owner_PersonId
  WHERE C.CandidateId = pCandidateId;
END ;;

DELIMITER ;

--
-- Dumping routines for database 'hpcloudrecruiting'
--
DROP PROCEDURE IF EXISTS `uspChangeNote`;

DELIMITER ;;

CREATE PROCEDURE `uspChangeNote`(IN pCandidateId INT, IN pNewNote varchar(5000))
BEGIN

 UPDATE Candidate

 SET    Notes = pNewNote

 WHERE  CandidateId  = pCandidateId;

SELECT CandidateId,
       C.FirstName,
       C.LastName,
       TagLine,
       Notes,
       JobLink,
       C.EmailAddress,
       LastModified,
       DueDate,
       P.Name,
       S.StageId,
       S.name AS 'State_Name',
       R.FirstName AS 'Recruiter_Name',
       C.Recruiter_PersonId,
       C.Owner_PersonId,
       O.FirstName AS 'Owner_Name'
  FROM  Candidate C
  INNER JOIN Position P ON P.PositionID = C.Position_PositionId
  INNER JOIN State S ON S.StageId = C.CurrentStage
  INNER JOIN Person R ON R.PersonId = C.Recruiter_PersonId
  INNER JOIN Person O ON O.PersonId = C.Owner_PersonId
  WHERE C.CandidateId = pCandidateId;
END ;;

DELIMITER ;

DROP PROCEDURE IF EXISTS `uspGetCandidates`;

DELIMITER ;;

CREATE PROCEDURE `uspGetCandidates`()
BEGIN

 SELECT CandidateId,
       C.FirstName,
       C.LastName,
       TagLine,
       Notes,
       JobLink,
       C.EmailAddress,
       C.Recruiter_PersonId,
       C.Owner_PersonId,
       LastModified,
       DueDate,
       P.Name,
       S.StageId AS 'State_Id',
       S.name AS 'State_Name',
       R.FirstName AS 'Recruiter_Name',
       C.Recruiter_PersonId,
       C.Owner_PersonId,
       O.FirstName AS 'Owner_Name'
  FROM  Candidate C
  INNER JOIN Position P ON P.PositionID = C.Position_PositionId
  INNER JOIN State S ON S.StageId = C.CurrentStage
  INNER JOIN Person R ON R.PersonId = C.Recruiter_PersonId
  INNER JOIN Person O ON O.PersonId = C.Owner_PersonId;
END ;;

DELIMITER ;

DROP PROCEDURE IF EXISTS `uspGetStates`;
DELIMITER ;;

CREATE PROCEDURE `uspGetStates`()
BEGIN

 SELECT StageId, Name
   FROM   State;
END ;;

DELIMITER ;

DROP PROCEDURE IF EXISTS `uspGetRecruiters`;

DELIMITER ;;

CREATE PROCEDURE `uspGetRecruiters`()
BEGIN

 SELECT PersonId, FirstName, LastName, EmailAddress, R.Name AS 'Role_Name', R.RoleId AS 'RoleId'
   FROM   Person P
   INNER JOIN Role R ON R.RoleId = P.Role_RoleId
   WHERE R.Name = 'Recruiter';
END ;;

DELIMITER ;

DROP PROCEDURE IF EXISTS `uspGetPersons`;

DELIMITER ;;

CREATE PROCEDURE `uspGetPersons`()
BEGIN

 SELECT PersonId, FirstName, LastName, EmailAddress, R.Name AS 'Role_Name', R.RoleId AS 'RoleId'
   FROM   Person P
   INNER JOIN Role R ON R.RoleId = P.Role_RoleId;
END ;;

DELIMITER ;

DROP PROCEDURE IF EXISTS `uspGetPositions`;

DELIMITER ;;

CREATE PROCEDURE `uspGetPositions`()
BEGIN

       SELECT `Position`.`PositionId`,

    `Position`.`Name`,

    `Position`.`Description`,

    `Position`.`DatePosted`,

    `Position`.`JobLink`

FROM Position;

END ;;

DELIMITER ;

DROP PROCEDURE IF EXISTS `uspInsertCandidate`;

DELIMITER ;;

CREATE PROCEDURE `uspInsertCandidate`(
        IN  pFirstName                    VARCHAR(2500)   ,
        IN  pLastName                     VARCHAR(2500)   ,
        IN  pEmailAddress                 VARCHAR(2500)   ,
        IN  pNotes                        VARCHAR(2000)  ,
        IN  pPositionId                   INT,
        IN  pRecruiterId                  INT,
        IN  pOwnerId                      INT,
        IN  pTagLine                      VARCHAR(2500)

     )
BEGIN

    INSERT INTO Candidate
         (
           FirstName                    ,
           LastName                     ,
           EmailAddress                 ,
           Notes                        ,
           Position_PositionId          ,
           Recruiter_PersonId           ,
           Owner_PersonId               ,
           TagLine                      ,
           CurrentStage                 ,
           DueDate
         )
    VALUES
         (
           pFirstName                    ,
           pLastName                     ,
           pEmailAddress                 ,
           pNotes                        ,
           pPositionId                   ,
           pRecruiterId                  ,
           pOwnerId                      ,
           pTagLine                      ,
           1,
           CURDATE() + INTERVAL 2 DAY
         ) ;

SELECT CandidateId,
       C.FirstName,
       C.LastName,
       TagLine,
       Notes,
       JobLink,
       C.EmailAddress,
       LastModified,
       DueDate,
       P.Name,
       S.StageId,
       S.name AS 'State_Name',
       R.FirstName AS 'Recruiter_Name',
       C.Recruiter_PersonId,
       C.Owner_PersonId,
       O.FirstName AS 'Owner_Name'
  FROM  Candidate C
  INNER JOIN Position P ON P.PositionID = C.Position_PositionId
  INNER JOIN State S ON S.StageId = C.CurrentStage
  INNER JOIN Person R ON R.PersonId = C.Recruiter_PersonId
  INNER JOIN Person O ON O.PersonId = C.Owner_PersonId
  WHERE C.CandidateId = Last_Insert_Id();

END ;;

DELIMITER ;

DROP PROCEDURE IF EXISTS `uspInsertPosition`;

DELIMITER ;;

CREATE PROCEDURE `uspInsertPosition`(
        IN  pName                    VARCHAR(2500)  ,
        IN  pDescription             VARCHAR(2500)  ,
        IN  pJobLink                 VARCHAR(100)

     )
BEGIN

    INSERT INTO Position
         (
           Name            ,
           Description     ,
           JobLink
         )
    VALUES
         (
           pName                    ,
           pDescription              ,
           pJobLink
         )  ;

Select * from Position where PositionId = Last_Insert_Id();
END ;;
DELIMITER ;
